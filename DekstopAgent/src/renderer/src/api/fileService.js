import axios from 'axios';

const BASE_URL = 'https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com';

export const fetchProviderFiles = async (providerId) => {
  const res = await axios.get(`${BASE_URL}/provider/allFiles/${providerId}`);
  console.log("The files stored are ", res.data);
  
  return res.data;
};

export const syncFile = async (ipfsHash) => {
  try {
    console.log(`[syncFile] Starting sync for IPFS hash: ${ipfsHash}`);

    const result = await window.electronAPI.syncFile(ipfsHash);
    console.log(`[syncFile] Local sync result:`, result);

    if (!result.success) {
      console.error(`[syncFile] Local sync failed: ${result.error || 'Unknown error'}`);
      throw new Error(result.error || 'Failed to sync file locally');
    }

    console.log(`[syncFile] Marking file as synced in backend for IPFS hash: ${ipfsHash}`);
    const backendResponse = await axios.post(`${BASE_URL}/provider/files/mark-synced/${ipfsHash}`);
    console.log(`[syncFile] Backend response:`, backendResponse.data);

    console.log(`[syncFile] Successfully synced and marked file: ${ipfsHash}`);
    return { success: true, message: 'File synced and marked as synced in backend' };
  } catch (error) {
    console.error(`[syncFile] Error syncing file ${ipfsHash}:`, error);
    throw error; 
  }
};



