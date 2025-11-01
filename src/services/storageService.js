import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';

export const uploadReceipt = async (userId, bikeId, uri, filename) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `receipts/${userId}/${bikeId}/${filename}`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading receipt:', error);
    return { success: false, error: error.message };
  }
};

export const deleteReceipt = async (downloadURL) => {
  try {
    const path = downloadURL.split('/o/')[1]?.split('?')[0];
    if (!path) {
      throw new Error('Invalid download URL');
    }
    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return { success: false, error: error.message };
  }
};

export const uploadBikeImage = async (userId, bikeId, uri, filename) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `bikes/${userId}/${bikeId}/${filename}`);
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading bike image:', error);
    return { success: false, error: error.message };
  }
};
