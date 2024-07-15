document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(function (element) {
        element.textContent = '';
    });

    // Get form data
    const firstName = document.getElementById('fName').value;
    const middleName = document.getElementById('mName').value;
    const lastName = document.getElementById('lName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phone').value; // Add a phone input field in the form if it's required

    // Basic client-side validation
    if (!firstName) {
        document.getElementById('first_name_message').textContent = 'First name is required';
        return;
    }
    if (!lastName) {
        document.getElementById('last_name_message').textContent = 'Last name is required';
        return;
    }
    if (!email) {
        document.getElementById('email_message').textContent = 'Email is required';
        return;
    }
    if (!password) {
        document.getElementById('password_message').textContent = 'Password is required';
        return;
    }

    // Prepare data to send
    const data = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phoneNumber
    };

    try {
        console.log(data)
        const response = await fetch('http://localhost/flightsteam-back-end/api/users/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(response.body)
        const result = await response.json();

        if (response.ok && result.status === 200) {
            alert('Data submitted successfully');
            window.location.href = 'verification.html'
        } else {
            alert(result.message + " edit");
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
