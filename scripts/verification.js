// verification.js

// Function to generate OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Dummy function to simulate sending OTP via email
function sendOtpEmail(email, otp) {
    console.log(`Sending OTP ${otp} to email: ${email}`);
    // Implement actual email sending logic here
}

// Function to validate the entered OTP
function validateOtp(inputOtp, actualOtp) {
    return inputOtp === actualOtp;
}

document.addEventListener('DOMContentLoaded', () => {
    const otpForm = document.getElementById('otpForm');
    const otpInputs = document.querySelectorAll('.otp-input');

    // Retrieve the email from localStorage
    const formData = JSON.parse(localStorage.getItem('formData'));
    const userEmail = formData ? formData.email : null;

    if (userEmail) {
        let generatedOtp = generateOtp();

        // Simulate sending OTP via email
        sendOtpEmail(userEmail, generatedOtp);
        

        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.value = value.replace(/[^0-9]/g, ''); // Remove any non-numeric characters

                if (value.length === 6) {
                    // Split the value into individual digits and fill the inputs
                    const digits = value.split('');
                    otpInputs.forEach((input, i) => {
                        input.value = digits[i] || '';
                    });
                    otpInputs[5].focus(); // Focus the last input if all 6 digits are entered
                } else if (input.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect the entered OTP
            let enteredOtp = '';
            otpInputs.forEach(input => {
                enteredOtp += input.value;
            });

            // Validate the entered OTP
            if (validateOtp(enteredOtp, generatedOtp)) {
                alert('OTP verified successfully!');
                window.location.href = 'index.html';
                // Redirect or perform further actions
            } else {
                alert('Invalid OTP. Please try again.');
            }
        });
    } else {
        alert('No email found. Please go back and enter your email.');
        // Redirect to the previous page or handle the error
    }
});
