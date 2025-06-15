document.addEventListener('DOMContentLoaded', () => {
  const serverList = document.getElementById('server-list');
  const addServerForm = document.getElementById('add-server-form');

  // Загрузка серверов из localStorage
  function loadServers() {
    const servers = JSON.parse(localStorage.getItem('servers') || '[]');
    serverList.innerHTML = '';
    servers.forEach(server => {
      const serverCard = document.createElement('div');
      serverCard.className = 'bg-white p-4 rounded-lg shadow-md';
      serverCard.innerHTML = `
        <h3 class="text-lg font-semibold">${server.name}</h3>
        <p class="text-gray-600">IP: ${server.ip}</p>
        <p class="text-gray-600">${server.description || 'Нет описания'}</p>
      `;
      serverList.appendChild(serverCard);
    });
  }

  // Добавление нового сервера
  if (addServerForm) {
    addServerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('server-name').value;
      const ip = document.getElementById('server-ip').value;
      const description = document.getElementById('server-desc').value;

      const servers = JSON.parse(localStorage.getItem('servers') || '[]');
      servers.push({ name, ip, description });
      localStorage.setItem('servers', JSON.stringify(servers));

      alert('Сервер добавлен!');
      window.location.href = 'index.html';
    });
  }

  // Загрузка серверов на главной странице
  if (serverList) {
    loadServers();
  }
});
