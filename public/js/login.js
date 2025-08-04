import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/v1/users/signin',
      data: {
        email: email,
        password: password,
      },
    });

    /** Showing alert and redirecting to home page */
    if (response.data.status === 'success') {
      //   alert('Logged in successfully');
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // alert(err.response.data.message);
    console.log(err.response);
    showAlert('error', err.response.data.message);
  }
};
