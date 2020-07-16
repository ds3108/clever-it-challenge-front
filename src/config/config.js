
require('dotenv').config();

let apiUri = '';


if (process.env.REACT_APP_ENV === 'TEST') {
  apiUri = `${process.env.REACT_APP_URI}`;
} else {
  apiUri = `${process.env.REACT_APP_URI_PROD}`;
}

const apiClient = {
  users: `${apiUri}/users`,
};

export default apiClient;