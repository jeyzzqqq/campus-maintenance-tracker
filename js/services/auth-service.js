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
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                console.log(`Creating new user profile for ${user.uid} with role: ${role}`);
                try {
                    await setDoc(userRef, {
                        email: user.email || '',
                        displayName: user.displayName || '',
                        role: role,
                        authProvider: user.providerData?.[0]?.providerId || 'password',
                        createdAt: serverTimestamp()
                    });
                } catch (writeError) {
                    console.error('Error creating user profile in Firestore:', writeError);
                    // Return the role we're trying to set, but log the error
                }
                return role;
            }

            const userRole = userDoc.data()?.role || role;
            console.log(`Retrieved user profile for ${user.uid}: role=${userRole}`);
            return userRole;
        } catch (error) {
            console.error('Error in ensureUserProfile:', error);
            // If Firestore is not accessible, we can't verify the role
            // This is a critical issue - we should return an error
            throw new Error(`Cannot verify user role: ${error.message}`);
        }
    },

    verifyRoleAccess: async (user, expectedRole = 'user') => {
        try {
            const actualRole = await authService.ensureUserProfile(user, expectedRole);

            console.log(`Role verification: user=${user.uid}, expected=${expectedRole}, actual=${actualRole}`);

            if (actualRole !== expectedRole) {
                console.warn(`Role mismatch detected! Expected ${expectedRole} but found ${actualRole}`);
                await signOut(auth);
                return {
                    success: false,
                    error: `This account is registered as ${actualRole}. Please switch to the ${actualRole} login.`
                };
            }

            return { success: true, role: actualRole };
        } catch (error) {
            console.error('Error in verifyRoleAccess:', error);
            return {
                success: false,
                error: 'Role verification failed. Please try again.'
            };
        }
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
    signIn: async (email, password, expectedRole = 'user') => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const accessCheck = await authService.verifyRoleAccess(user, expectedRole);
            if (!accessCheck.success) {
                console.warn('Role verification failed on sign-in:', accessCheck.error);
                return accessCheck;
            }

            const role = accessCheck.role;
            console.log(`User ${email} signed in successfully with role: ${role}`);

            return { success: true, user, role };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    signInWithGoogle: async (expectedRole = 'user') => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const accessCheck = await authService.verifyRoleAccess(user, expectedRole);
            if (!accessCheck.success) {
                console.warn('Role verification failed on Google sign-in:', accessCheck.error);
                return accessCheck;
            }

            const role = accessCheck.role;
            console.log(`User ${user.email} signed in with Google successfully, role: ${role}`);

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