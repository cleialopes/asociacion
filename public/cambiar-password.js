document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-icon');

  toggles.forEach(toggle => {
    const input = document.getElementById(toggle.dataset.target);

    toggle.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.textContent = isPassword ? '🙈' : '👁️';
    });
  });
});
