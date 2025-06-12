import axios from 'axios';
const BASE_URL = 'https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com';

export const loginProvider = async (email, password) => {
  const res = await axios.post(`https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/auth/login`, {
    email,
    password
  });

  console.log(res.data);
  

  const providerId = res.data.user.id;

  // ✅ Store providerId in cookie
  document.cookie = `providerId=${providerId}; path=/; SameSite=Strict`;

  console.log('Logged in and stored providerId in cookie:', providerId);


  return res.data.user;
};


