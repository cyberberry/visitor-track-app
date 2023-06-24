document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {

        event.preventDefault();

        const loginInput = document.getElementById('login');
        const passwordInput = document.getElementById('password');

        const login = loginInput.value;
        const password = passwordInput.value;

        // Check if the login and password are valid
        if (login === 'admin' && password === 'admin') {

            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'index.html';
        }
        else {
            console.log('Invalid login or password');
        }

        loginInput.value = '';
        passwordInput.value = '';
    });
});
