import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const fetchProviderFiles = async (providerId) => {
  const res = await axios.get(`${BASE_URL}/provider/allFiles/${providerId}`);
  console.log("The files stored are ", res.data);
  
  return res.data;
};

export const syncFile = async (ipfsHash) => {
  try {
    console.log(`[syncFile] Starting sync for IPFS hash: ${ipfsHash}`);

    // Step 1: Sync file locally via Electron API
    const result = await window.electronAPI.syncFile(ipfsHash);
    console.log(`[syncFile] Local sync result:`, result);

    if (!result.success) {
      console.error(`[syncFile] Local sync failed: ${result.error || 'Unknown error'}`);
      throw new Error(result.error || 'Failed to sync file locally');
    }

    // Step 2: Call backend API to mark the file as synced
    console.log(`[syncFile] Marking file as synced in backend for IPFS hash: ${ipfsHash}`);
    const backendResponse = await axios.post(`${BASE_URL}/provider/files/mark-synced/${ipfsHash}`);
    console.log(`[syncFile] Backend response:`, backendResponse.data);

    // Return success result
    console.log(`[syncFile] Successfully synced and marked file: ${ipfsHash}`);
    return { success: true, message: 'File synced and marked as synced in backend' };
  } catch (error) {
    console.error(`[syncFile] Error syncing file ${ipfsHash}:`, error);
    throw error; // re-throw to handle upstream
  }
};


