document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  toggle.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? '🙈' : '👁️';
  });
});