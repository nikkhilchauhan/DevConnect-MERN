import axios from 'axios';

// setAuthToken sets to send 'x-auth-token' by default  into axios headers if token exists
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
