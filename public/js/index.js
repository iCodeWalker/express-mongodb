import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateData, updatePassword } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
/** user data update form */
const userUpdateForm = document.querySelector('.form-user-data');
/** update password form */
const userUpdatePassword = document.querySelector('.form-user-settings');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

if (userUpdateForm) {
  userUpdateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateData(name, email);
  });
}

if (userUpdatePassword) {
  userUpdatePassword.addEventListener('submit', async (event) => {
    event.preventDefault();
    /** Upadating button html on click of button */
    document.querySelector('.btn-save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    await updatePassword(
      { currentPassword, password, confirmPassword },
      'password'
    );

    /** Setting values of fields to empty after successfully changing the password */
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    /** Upadating button html back to default */
    document.querySelector('.btn-save-password').textContent = 'Save password';
  });
}
