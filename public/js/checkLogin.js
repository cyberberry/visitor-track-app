// Check login status
const isLoggedIn = sessionStorage.getItem('isLoggedIn');
if (!isLoggedIn || isLoggedIn !== 'true') {
  window.location.href = 'login.html'; // Redirect to login page
}
