import {
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
	collection,
	doc,
	getDoc,
	serverTimestamp,
	setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "../config/firebase-config.js";

// Authentication Service

export const authService = {
    ensureUserProfile: async (user, role = 'user') => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, {
                email: user.email || '',
                displayName: user.displayName || '',
                role: role,
                authProvider: user.providerData?.[0]?.providerId || 'password',
                createdAt: serverTimestamp()
            });
            return role;
        }

        return userDoc.data()?.role || role;
    },

    // Sign up new user
    signUp: async (email, password, role = 'user') => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                displayName: user.displayName || '',
                role: role,
                authProvider: 'password',
                createdAt: serverTimestamp()
            });

            return { success: true, user, role };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    signIn: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const role = await authService.ensureUserProfile(user, 'user');

            return { success: true, user, role };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const role = await authService.ensureUserProfile(user, 'user');

            return { success: true, user, role };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Get user data from Firestore
    getUserData: async (uid) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    // Auth state observer
    onAuthStateChanged: (callback) => {
        onAuthStateChanged(auth, callback);
    }
};

if (typeof window !== 'undefined') {
	window.authService = authService;
}