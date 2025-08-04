import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: 'http://localhost:5000/api/v1/users/update-user-data',
      data: {
        name: name,
        email: email,
      },
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Data updated successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

/** Update user settings
 * type === 'password' or 'data'
 */
export const updatePassword = async (data, type) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: 'http://localhost:5000/api/v1/users/update-password/',
      data: data,
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Password updated successfully');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
