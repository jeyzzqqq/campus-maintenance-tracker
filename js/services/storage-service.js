import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { auth, storage } from "../config/firebase-config.js";

// Firebase Storage Service

export const storageService = {
    // Upload image
    uploadImage: async (file, path = 'issues') => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No authenticated user');

            const timestamp = Date.now();
            const fileName = `${path}/${user.uid}_${timestamp}_${file.name}`;
            const storageRef = ref(storage, fileName);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            return { success: true, url: downloadURL };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete image
    deleteImage: async (imageUrl) => {
        try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting image:', error);
            return { success: false, error: error.message };
        }
    }
};

if (typeof window !== 'undefined') {
	window.storageService = storageService;
}