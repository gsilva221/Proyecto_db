const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const formMessage = document.getElementById('formMessage');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    formMessage.textContent = 'Por favor completa ambos campos.';
    return;
  }

  formMessage.textContent = '';
  loginForm.querySelector('button').textContent = 'Ingresando...';
  loginForm.querySelector('button').disabled = true;

  setTimeout(() => {
    loginForm.querySelector('button').textContent = 'Iniciar sesión';
    loginForm.querySelector('button').disabled = false;
    showSuccess();
  }, 900);
});

function showSuccess() {
  formMessage.style.color = '#34d399';
  formMessage.textContent = 'Bienvenido a CondoManage. Inicio de sesión exitoso.';
  setTimeout(() => {
    window.location.href = '/';
  }, 1200);
}
