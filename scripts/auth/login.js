// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// On page load, check if the token exists
document.addEventListener("DOMContentLoaded", function () {
    const token = getCookie('token');
    if (token) {
        window.location.href = "/index.html";
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = getCookie('token');
    if (token) {
        window.location.href = '/index.html';
        return;
    }

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare data to send
    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost/flightsteam-back-end/api/users/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 200) {
            document.cookie = `token=${result.data.token}; Max-Age=${60 * 60}; path=/; Secure; HttpOnly`;
            window.location.href = '/index.html';
        } else {
            alert(result.message);
        }

    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
