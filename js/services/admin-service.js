import { collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../config/firebase-config.js";

// Admin helper utilities (use from browser console)
export const adminService = {
    promoteUserByEmail: async (email, newRole = 'admin') => {
        if (!email) throw new Error('Email is required');
        try {
            const usersCol = collection(db, 'users');
            const q = query(usersCol, where('email', '==', email));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.warn('No user document found for', email);
                return { success: false, error: 'No user document found for that email' };
            }

            const updates = [];
            snapshot.forEach(docSnap => {
                updates.push(updateDoc(doc(db, 'users', docSnap.id), { role: newRole }));
            });

            await Promise.all(updates);
            console.log(`Updated ${updates.length} user(s) to role: ${newRole}`);
            return { success: true, updated: updates.length };
        } catch (error) {
            console.error('Error promoting user:', error);
            return { success: false, error: error.message };
        }
    }
};

if (typeof window !== 'undefined') {
    window.adminService = adminService;
}
