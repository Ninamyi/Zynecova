document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value.trim();
  const errorMsg = document.getElementById('mensaje-error');

  if (!usuario || !clave) {
    errorMsg.textContent = '⚠️ Por favor completa todos los campos.';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('usuarioActivo', data.nombre);
      localStorage.setItem('rol', data.rol);

      switch (data.rol) {
        case 'administrador':
          window.location.href = 'admin.html';
          break;
        case 'empleado':
          window.location.href = 'empleado.html';
          break;
        case 'soporte':
          window.location.href = 'soporte.html';
          break;
        default:
          window.location.href = 'index.html';
          break;
      }
    } else {
      errorMsg.textContent = data.message || '❌ Usuario o contraseña incorrectos.';
    }
  } catch (err) {
    console.error(err);
    errorMsg.textContent = '⚠️ Error de conexión con el servidor.';
  }
});
