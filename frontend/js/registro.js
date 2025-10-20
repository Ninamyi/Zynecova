document.getElementById('registroForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();
  const rol = document.getElementById('rol').value;

  if (!nombre || !correo || !password || !rol) {
    alert('Por favor completa todos los campos.');
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const existe = usuarios.some(user => user.correo === correo);
  if (existe) {
    alert('El correo ya está registrado. Intenta iniciar sesión.');
    return;
  }

  const nuevoUsuario = {
    id: Date.now(),
    nombre,
    correo,
    password,
    rol
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
  window.location.href = 'login.html';
});
