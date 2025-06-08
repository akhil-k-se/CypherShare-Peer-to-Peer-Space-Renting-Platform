import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const fetchProviderFiles = async (providerId) => {
  const res = await axios.get(`${BASE_URL}/provider/allFiles/${providerId}`);
  return res.data;
};

export const syncFile = async (ipfsHash) => {
  const res = await axios.post(`${BASE_URL}/files/sync/${ipfsHash}`);
  return res.data;
};
