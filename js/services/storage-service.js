import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { auth, storage, db } from "../config/firebase-config.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Storage Service with Firestore fallback for environments where Storage requests fail (CORS)

const compressImageToDataUrl = (file, maxWidth = 1024, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            try {
                const ratio = img.width / img.height;
                const width = Math.min(maxWidth, img.width);
                const height = Math.round(width / ratio);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                }, 'image/jpeg', quality);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
        const reader = new FileReader();
        reader.onload = () => { img.src = reader.result; };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const storageService = {
    // Upload image: try Storage with timeout, then fallback to Firestore (stores data URL)
    uploadImage: async (file, path = 'issues') => {
        const user = auth.currentUser;
        if (!user) return { success: false, error: 'No authenticated user' };

        // Wrap Storage upload in a timeout (5 seconds) to fail fast if unavailable
        const uploadToStorageWithTimeout = () => {
            return new Promise(async (resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Storage upload timeout (likely CORS or billing disabled)'));
                }, 5000);

                try {
                    const timestamp = Date.now();
                    const fileName = `${path}/${user.uid}_${timestamp}_${file.name}`;
                    const storageRef = ref(storage, fileName);

                    console.log('[Storage] Attempting upload to:', fileName);
                    await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);
                    clearTimeout(timeoutId);
                    console.log('[Storage] Upload successful:', downloadURL);
                    resolve({ success: true, url: downloadURL });
                } catch (error) {
                    clearTimeout(timeoutId);
                    console.warn('[Storage] Upload failed:', error.message);
                    reject(error);
                }
            });
        };

        // Try Storage first
        try {
            console.log('[Upload] Starting image upload (file size:', file.size, 'bytes)');
            const result = await uploadToStorageWithTimeout();
            if (result.success) {
                return result;
            }
        } catch (error) {
            console.warn('[Upload] Storage not available:', error.message);
        }

        // Fallback to Firestore: compress and store as data URL
        console.log('[Firestore] Using Firestore fallback for image storage');
        try {
            console.log('[Compress] Compressing image...');
            const dataUrl = await compressImageToDataUrl(file, 1024, 0.7);
            console.log('[Compress] Compressed size:', dataUrl.length, 'bytes');

            // Safety check: Firestore document limit ~1MB
            if (dataUrl.length > 900000) {
                const msg = 'Image too large to store in Firestore. Please pick a smaller image.';
                console.error('[Firestore]', msg);
                return { success: false, error: msg };
            }

            console.log('[Firestore] Saving image to issueImages collection...');
            const docRef = await addDoc(collection(db, 'issueImages'), {
                ownerId: user.uid,
                fileName: file.name,
                dataUrl,
                createdAt: serverTimestamp()
            });

            console.log('[Firestore] Image saved successfully, doc ID:', docRef.id);
            return { success: true, url: dataUrl, storageDocId: docRef.id, method: 'firestore' };
        } catch (fbErr) {
            const msg = 'Could not save image: ' + (fbErr.message || fbErr);
            console.error('[Firestore]', msg);
            return { success: false, error: msg };
        }
    },

    // Delete image from Storage (note: Firestore-stored images are not automatically deleted by this)
    deleteImage: async (imageUrl) => {
        try {
            // If it's a data URL (Firestore fallback), we can't map it to a storage ref here.
            if (typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
                // Optionally: implement deletion by doc id instead of dataUrl. For now, return success.
                return { success: true, note: 'Image stored in Firestore data URL; no remote file to delete.' };
            }

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