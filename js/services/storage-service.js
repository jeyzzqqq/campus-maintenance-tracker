// Firebase Storage Service

const storageService = {
    // Upload image
    uploadImage: async (file, path = 'issues') => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No authenticated user');

            const timestamp = Date.now();
            const fileName = `${path}/${user.uid}_${timestamp}_${file.name}`;
            const storageRef = storage.ref(fileName);

            // Upload file
            const snapshot = await storageRef.put(file);
            
            // Get download URL
            const downloadURL = await snapshot.ref.getDownloadURL();

            return { success: true, url: downloadURL };
        } catch (error) {
            console.error('Error uploading image:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete image
    deleteImage: async (imageUrl) => {
        try {
            const imageRef = storage.refFromURL(imageUrl);
            await imageRef.delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting image:', error);
            return { success: false, error: error.message };
        }
    }
};

window.storageService = storageService;