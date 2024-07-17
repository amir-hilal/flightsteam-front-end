
document.addEventListener('DOMContentLoaded', function () {
  const token = getCookie('token');
  if (token) {
    validateAdminToken(token).then((isValid) => {
      if (isValid) {
        window.location.href = '/pages/admin/adminDashboard.html';
      } else {
        window.location.href = '/index.html';
      }
    });
  }
});

// Form submission handling
document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
      email: email,
      password: password,
    };

    fetch('http://localhost/flightsteam-back-end/api/admins/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          document.cookie = `token=${data.data.token}; path=/`;
          window.location.href = '/pages/admin/adminDashboard.html';
        } else {
          alert('Invalid credentials. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  });
