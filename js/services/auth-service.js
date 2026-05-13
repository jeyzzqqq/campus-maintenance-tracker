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
    // Get existing user role from Firestore (strict - no creation)
    getUserRole: async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                return null; // User doesn't exist yet
            }
            
            return userDoc.data()?.role || null;
        } catch (error) {
            console.error('Error getting user role:', error);
            throw error;
        }
    },

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
                    throw new Error('Unable to create user profile. Firestore may be unavailable.');
                }
                return role;
            }

            const userRole = userDoc.data()?.role || role;
            console.log(`Retrieved user profile for ${user.uid}: role=${userRole}`);
            return userRole;
        } catch (error) {
            console.error('Error in ensureUserProfile:', error);
            throw new Error(`Cannot verify user role: ${error.message}`);
        }
    },

    verifyRoleAccess: async (user, expectedRole = 'user') => {
        try {
            // First, check if user exists in Firestore
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            console.log(`[VerifyRole] Checking user: ${user.email}, Expected role: ${expectedRole}, Exists in Firestore: ${userDoc.exists()}`);

            // If user doesn't exist, create them with the selected role
            if (!userDoc.exists()) {
                console.log(`[VerifyRole] Creating new user profile for ${user.uid} with role: ${expectedRole}`);
                await setDoc(userRef, {
                    email: user.email || '',
                    displayName: user.displayName || '',
                    role: expectedRole,
                    authProvider: user.providerData?.[0]?.providerId || 'password',
                    createdAt: serverTimestamp()
                });
                console.log(`[VerifyRole] New user created with role: ${expectedRole}`);
                return { success: true, role: expectedRole };
            }

            // User exists - verify role matches
            const actualRole = userDoc.data()?.role || 'user';
            console.log(`[VerifyRole] User exists in Firestore with role: ${actualRole}, Expected: ${expectedRole}`);

            if (actualRole !== expectedRole) {
                console.warn(`[VerifyRole] Role mismatch detected! Expected ${expectedRole} but found ${actualRole}`);
                await signOut(auth);
                return {
                    success: false,
                    error: `❌ This account is registered as a **${actualRole === 'admin' ? 'Staff/Admin' : 'Student'}** user.\n\nPlease sign in using the **${actualRole === 'admin' ? 'Staff' : 'Student'}** login button instead.`
                };
            }

            console.log(`[VerifyRole] Role verification passed for user: ${user.email}`);
            return { success: true, role: actualRole };
        } catch (error) {
            console.error('Error in verifyRoleAccess:', error);
            // Sign out on critical error to prevent unauthorized access
            try {
                await signOut(auth);
            } catch (e) {
                console.error('Error signing out:', e);
            }
            return {
                success: false,
                error: 'Unable to verify your account. Please try again.'
            };
        }
    },

    // Sign up new user
    signUp: async (email, password, role = 'user') => {
        try {
            // Ensure role is valid
            if (role !== 'user' && role !== 'admin') {
                role = 'user'; // Default to user if invalid
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log(`[SignUp] Creating new user: ${email} with role: ${role}`);

            await setDoc(doc(db, 'users', user.uid), {
                email: email,
                displayName: user.displayName || '',
                role: role, // Use the role parameter passed in
                authProvider: 'password',
                createdAt: serverTimestamp()
            });

            console.log(`[SignUp] User profile created successfully with role: ${role}`);
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

            console.log(`[SignIn] User authenticated: ${email}, Expected role: ${expectedRole}`);

            const accessCheck = await authService.verifyRoleAccess(user, expectedRole);
            if (!accessCheck.success) {
                console.warn('Role verification failed on sign-in:', accessCheck.error);
                // CRITICAL: Ensure user is signed out before returning error
                try {
                    await signOut(auth);
                } catch (e) {
                    console.error('Failed to sign out after role verification:', e);
                }
                return accessCheck;
            }

            const role = accessCheck.role;
            console.log(`[SignIn] User ${email} signed in successfully with role: ${role}`);

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
                // CRITICAL: Ensure user is signed out before returning error
                try {
                    await signOut(auth);
                } catch (e) {
                    console.error('Failed to sign out after role verification:', e);
                }
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