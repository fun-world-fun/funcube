document.addEventListener('DOMContentLoaded', () => {
  const serverList = document.getElementById('server-list');
  const addServerForm = document.getElementById('add-server-form');
  const searchInput = document.getElementById('search');
  const toggleThemeBtn = document.getElementById('toggleTheme');

  // Переключение темы
  if (toggleThemeBtn) {
    toggleThemeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      toggleThemeBtn.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    // Загрузка сохраненной темы
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      toggleThemeBtn.innerHTML = `<i class="fas fa-sun"></i>`;
    }
  }

  // Валидация IP-адреса
  function isValidIP(ip) {
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ip);
  }

  // Имитация проверки статуса сервера (случайный онлайн/оффлайн)
  function checkServerStatus() {
    return Math.random() > 0.3 ? 'online' : 'offline';
  }

  // Загрузка и отображение серверов
  function loadServers(filter = '') {
    const servers = JSON.parse(localStorage.getItem('servers') || '[]');
    if (serverList) {
      serverList.innerHTML = '';
      const filteredServers = servers.filter(server =>
        server.name.toLowerCase().includes(filter.toLowerCase()) ||
        server.ip.includes(filter)
      );
      if (filteredServers.length === 0) {
        serverList.innerHTML = '<p class="text-center text-gray-500 col-span-full">Сервера не найдены</p>';
        return;
      }
      filteredServers.forEach((server, index) => {
        const status = checkServerStatus();
        const serverCard = document.createElement('div');
        serverCard.className = 'server-card bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between fade-in';
        serverCard.innerHTML = `
          <div>
            <h3 class="text-xl font-semibold flex items-center gap-2">
              <i class="fas fa-server"></i> ${server.name}
            </h3>
            <p class="text-gray-600 mt-2">IP: ${server.ip}</p>
            <p class="text-gray-600 mt-1">${server.description || 'Нет описания'}</p>
            <p class="mt-2 flex items-center gap-2">
              <span class="w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}"></span>
              ${status === 'online' ? 'Онлайн' : 'Оффлайн'}
            </p>
          </div>
          <button class="delete-btn mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" data-index="${index}">
            <i class="fas fa-trash"></i> Удалить
          </button>
        `;
        serverList.appendChild(serverCard);
      });

      // Обработчики удаления
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('Вы уверены, что хотите удалить этот сервер?')) {
            const index = btn.dataset.index;
            servers.splice(index, 1);
            localStorage.setItem('servers', JSON.stringify(servers));
            loadServers(filter);
          }
        });
      });
    }
  }

  // Поиск серверов
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadServers(searchInput.value);
    });
  }

  // Добавление нового сервера
  if (addServerForm) {
    const nameInput = document.getElementById('server-name');
    const ipInput = document.getElementById('server-ip');
    const nameError = document.getElementById('name-error');
    const ipError = document.getElementById('ip-error');

    addServerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Валидация имени
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        nameError.classList.remove('hidden');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        nameError.classList.add('hidden');
      }

      // Валидация IP
      if (!isValidIP(ipInput.value)) {
        ipInput.classList.add('error');
        ipError.classList.remove('hidden');
        isValid = false;
      } else {
        ipInput.classList.remove('error');
        ipError.classList.add('hidden');
      }

      if (isValid) {
        const name = nameInput.value;
        const ip = ipInput.value;
        const description = document.getElementById('server-desc').value;

        const servers = JSON.parse(localStorage.getItem('servers') || '[]');
        servers.push({ name, ip, description });
        localStorage.setItem('servers', JSON.stringify(servers));

        alert('Сервер успешно добавлен!');
        window.location.href = 'index.html';
      }
    });
  }

  // Загрузка серверов на главной странице
  if (serverList) {
    loadServers();
  }
});
