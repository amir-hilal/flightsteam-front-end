document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

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
            document.cookie = `token=${result.data.token}; Max-Age=${60 * 60}; path=/`;
            window.location.href = '/index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
