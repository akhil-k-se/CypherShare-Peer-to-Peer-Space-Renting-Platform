import axios from 'axios';
const BASE_URL = 'http://localhost:5000';

export const loginProvider = async (email, password) => {
  const res = await axios.post(`http://localhost:5000/auth/login`, { email, password });
  console.log(res);
  
  return res.data.user; // contains provider info and maybe token
};
