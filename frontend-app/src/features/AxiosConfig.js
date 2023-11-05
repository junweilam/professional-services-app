import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Set your API base URL here
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('signin');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration here
      localStorage.removeItem('token'); // Remove the token from localStorage
      window.location.href = '/signin'; // Redirect to the login page
    }
    return Promise.reject(error);
  }
);

export default instance;