document.addEventListener('DOMContentLoaded', () => {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});

document.getElementById('otpForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get OTP values
    const otpInputs = document.querySelectorAll('.otp-input');
    let otpCode = '';
    otpInputs.forEach(input => {
        otpCode += input.value;
    });

    // Basic client-side validation
    if (otpCode.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    // Get the email from session storage or any other source
    const email = localStorage.getItem('email');

    // Prepare data to send
    const data = {
        email: email,
        verification_code: otpCode
    };

    try {
        const response = await fetch('http://localhost/flightsteam-back-end/api/users/verify.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.status === 200) {
            // alert('OTP verification successful');
            // Redirect to the next page or show success message
            localStorage.removeItem('email')
            window.location.href = 'index.html';

        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
