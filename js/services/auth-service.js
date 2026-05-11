// Authentication Service

const authService = {
    ensureUserProfile: async (user, role = 'user') => {
        const userRef = db.collection('users').doc(user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                email: user.email || '',
                displayName: user.displayName || '',
                role: role,
                authProvider: user.providerData?.[0]?.providerId || 'password',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return role;
        }

        return userDoc.data()?.role || role;
    },

    // Sign up new user
    signUp: async (email, password, role = 'user') => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                displayName: user.displayName || '',
                role: role,
                authProvider: 'password',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true, user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    signIn: async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const result = await auth.signInWithPopup(provider);
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
            await auth.signOut();
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
            const userDoc = await db.collection('users').doc(uid).get();
            return userDoc.exists ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    // Auth state observer
    onAuthStateChanged: (callback) => {
        auth.onAuthStateChanged(callback);
    }
};

window.authService = authService;