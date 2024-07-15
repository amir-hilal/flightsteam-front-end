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
            alert('Login successful');
            // Save the token or user data in sessionStorage or localStorage
            sessionStorage.setItem('token', result.token);
            // Redirect to the dashboard or home page
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
