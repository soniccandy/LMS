import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5001', // local
  baseURL: 'http://3.26.99.94:5001', // live
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default axiosInstance;
