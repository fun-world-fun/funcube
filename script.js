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

  // Имитация проверки статуса сервера
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
        server.ip.toLowerCase().includes(filter.toLowerCase())
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
          <div class="flex items-start gap-4">
            <img src="${server.icon || ''}" class="w-12 h-12 object-cover rounded ${server.icon ? '' : 'hidden'}" alt="Иконка сервера" onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
            <i class="fas fa-server w-12 h-12 text-gray-400 flex items-center justify-center ${server.icon ? 'hidden' : ''}"></i>
            <div class="flex-1">
              <h3 class="text-xl font-semibold">${server.name}</h3>
              <p class="text-gray-600 mt-1">IP: ${server.ip}</p>
              <p class="text-gray-600 mt-1">${server.description || 'Нет описания'}</p>
              <p class="mt-2 flex items-center gap-2">
                <span class="w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}"></span>
                ${status === 'online' ? 'Онлайн' : 'Оффлайн'}
              </p>
            </div>
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
      loadServers(searchInput.value.trim());
    });
  }

  // Добавление нового сервера
  if (addServerForm) {
    const nameInput = document.getElementById('server-name');
    const ipInput = document.getElementById('server-ip');
    const iconInput = document.getElementById('server-icon');
    const iconPreview = document.getElementById('icon-preview');
    const nameError = document.getElementById('name-error');
    const ipError = document.getElementById('ip-error');
    const iconError = document.getElementById('icon-error');

    // Предпросмотр иконки
    iconInput.addEventListener('change', () => {
      const file = iconInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          iconPreview.src = reader.result;
          iconPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      } else {
        iconPreview.classList.add('hidden');
      }
    });

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

      // Валидация иконки
      let iconData = '';
      const file = iconInput.files[0];
      if (file) {
        if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 1024 * 1024) {
          iconInput.classList.add('error');
          iconError.classList.remove('hidden');
          isValid = false;
        } else {
          iconInput.classList.remove('error');
          iconError.classList.add('hidden');
          const reader = new FileReader();
          reader.onload = () => {
            iconData = reader.result;
            saveServer(nameInput.value, ipInput.value, document.getElementById('server-desc').value, iconData);
          };
          reader.readAsDataURL(file);
          return;
        }
      }

      if (isValid) {
        saveServer(nameInput.value, ipInput.value, document.getElementById('server-desc').value, iconData);
      }
    });

    function saveServer(name, ip, description, icon) {
      const servers = JSON.parse(localStorage.getItem('servers') || '[]');
      servers.push({ name, ip, description, icon });
      localStorage.setItem('servers', JSON.stringify(servers));
      alert('Сервер успешно добавлен!');
      window.location.href = 'index.html';
    }
  }

  // Загрузка серверов на главной странице
  if (serverList) {
    loadServers();
  }
});
