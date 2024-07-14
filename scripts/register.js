const form = document.getElementById('registrationForm');
const first_name = document.getElementById('fName');
const middle_name = document.getElementById('mName');
const last_name = document.getElementById('lName');
const email = document.getElementById('email');
const password = document.getElementById('password');


const checkName = (name) => {
    if (name.value === "") {
        return false;
    }
    return true;
}

const checkEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const checkPassword = (password) => {
    return password.length >= 6;
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isName = checkName(first_name);
    const isMiddleName = checkName(middle_name);
    const isLastName = checkName(last_name);
    const isEmail = checkEmail(email.value);
    const isPassword = checkPassword(password.value);
    const isValid= isName && isMiddleName && isLastName &&isEmail &&isPassword;

    if (!isName) {
        document.getElementById('first_name_message').innerText = 'Required';
        first_name.style.borderColor ='red';
    }
    else {
        document.getElementById('first_name_message').innerText = '';
        first_name.style.borderColor ='';
    }
    if (!isMiddleName) {

        document.getElementById('middle_name_message').innerText = 'Required';
        middle_name.style.borderColor ='red';
    }
    else {
        document.getElementById('middle_name_message').innerText = '';
        middle_name.style.borderColor ='';
    }
    if (!isLastName) {
        document.getElementById('last_name_message').innerText = 'Required';
        last_name.style.borderColor= 'red';
    }
    else {
        document.getElementById('last_name_message').innerText = '';
        last_name.style.borderColor ='';
    }

    if (!isEmail) {
        document.getElementById('email_message').innerText = 'Invalid Email';
        email.style.borderColor ='red';
    }
    else {
        document.getElementById('email_message').innerText = '';
        email.style.borderColor ='';
    }
    if (!isPassword) {
        document.getElementById('password_message').innerText = 'Password needs to be at least 6 characters';
        password.style.borderColor = 'red';
    }
    else {
        document.getElementById('password_message').innerText = '';
        password.style.borderColor = '';
    }
    
    if(isValid){
        const formData = {
            firstName: document.getElementById('fName').value,
            lastName: document.getElementById('lName').value,
            email: document.getElementById('email').value
        };
        
        localStorage.setItem('formData', JSON.stringify(formData));
        window.location.href='verification.html';
    }
})

