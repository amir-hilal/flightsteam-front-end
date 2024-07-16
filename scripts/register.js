document.getElementById('registrationForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log("yaaaa")

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
    if (firstName == "") {
        document.getElementById('first_name_message').textContent = 'First name is required';
        return
    }
    if (!middleName) {
        document.getElementById('middle_name_message').textContent = 'middle name is required';
        return
    }
    if (!lastName) {
        document.getElementById('last_name_message').textContent = 'Last name is required';
        return
    }
    if (!email) {
        document.getElementById('email_message').textContent = 'Email is required';
        return
    }
    if (!password) {
        document.getElementById('password_message').textContent = 'Password is required';
        return
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.match(passwordRegex)) {
        showModal('Password must contain at least 8 characters,\none number, and one special character');
        return
    }
    document.getElementById('loadingOverlay').classList.remove('hidden');
    disableInteractions();

    // Prepare data to send
    const data = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phoneNumber
    };

    console.log(data)

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
            localStorage.setItem('email', data['email']);
            window.location.href = 'verification.html'
        } else {
        showModal('An error occurred: ' + error.message);
        }
    } catch (error) {
        showModal('An error occurred: ' + error.message);
    } finally{
        
        document.getElementById('loadingOverlay').classList.add('hidden');
        enableInteractions();
    }
});


function disableInteractions() {
    const interactiveElements = document.querySelectorAll('button, input, a');
    interactiveElements.forEach(element => {
        element.disabled = true;
        element.style.pointerEvents = 'none';
    });
}

function enableInteractions() {
    const interactiveElements = document.querySelectorAll('button, input, a');
    interactiveElements.forEach(element => {
        element.disabled = false;
        element.style.pointerEvents = 'auto';
    });
}


function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalMessage = modal.querySelector('p');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

document.getElementById('modalOkButton').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
});