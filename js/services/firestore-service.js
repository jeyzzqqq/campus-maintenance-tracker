// Firestore Database Service

const firestoreService = {
    isUnavailableError: (error) => {
        const message = (error && error.message) ? error.message.toLowerCase() : '';
        return message.includes('permission-denied') || message.includes('firestore api has not been used') || message.includes('service disabled');
    },

    handleUnavailable: (error, fallbackMessage) => {
        if (firestoreService.isUnavailableError(error)) {
            return { success: false, error: fallbackMessage || 'Firestore is not available yet. Enable the Firestore API in Firebase Console.' };
        }
        return { success: false, error: error.message };
    },

    // Create new issue report
    createIssue: async (issueData) => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No authenticated user');

            const issue = {
                ...issueData,
                userId: user.uid,
                userEmail: user.email,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('issues').add(issue);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error creating issue:', error);
            return firestoreService.handleUnavailable(error, 'Unable to save the report right now. Firestore needs to be enabled in Firebase Console.');
        }
    },

    // Get all issues
    getAllIssues: async () => {
        try {
            const snapshot = await db.collection('issues')
                .orderBy('createdAt', 'desc')
                .get();

            const issues = [];
            snapshot.forEach(doc => {
                issues.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, issues };
        } catch (error) {
            console.error('Error getting issues:', error);
            return { ...firestoreService.handleUnavailable(error, 'Reports cannot load until Firestore is enabled in Firebase Console.'), issues: [] };
        }
    },

    // Get issues by user
    getUserIssues: async (userId) => {
        try {
            const snapshot = await db.collection('issues')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const issues = [];
            snapshot.forEach(doc => {
                issues.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, issues };
        } catch (error) {
            console.error('Error getting user issues:', error);
            return { ...firestoreService.handleUnavailable(error, 'Your reports cannot load until Firestore is enabled in Firebase Console.'), issues: [] };
        }
    },

    // Get issues by status
    getIssuesByStatus: async (status) => {
        try {
            const snapshot = await db.collection('issues')
                .where('status', '==', status)
                .orderBy('createdAt', 'desc')
                .get();

            const issues = [];
            snapshot.forEach(doc => {
                issues.push({ id: doc.id, ...doc.data() });
            });

            return { success: true, issues };
        } catch (error) {
            console.error('Error getting issues by status:', error);
            return { ...firestoreService.handleUnavailable(error, 'Reports cannot load until Firestore is enabled in Firebase Console.'), issues: [] };
        }
    },

    // Get single issue
    getIssue: async (issueId) => {
        try {
            const doc = await db.collection('issues').doc(issueId).get();
            if (!doc.exists) {
                return { success: false, error: 'Issue not found' };
            }
            return { success: true, issue: { id: doc.id, ...doc.data() } };
        } catch (error) {
            console.error('Error getting issue:', error);
            return firestoreService.handleUnavailable(error, 'This report cannot load until Firestore is enabled in Firebase Console.');
        }
    },

    // Update issue
    updateIssue: async (issueId, updateData) => {
        try {
            await db.collection('issues').doc(issueId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating issue:', error);
            return firestoreService.handleUnavailable(error, 'Unable to update the report until Firestore is enabled in Firebase Console.');
        }
    },

    // Delete issue
    deleteIssue: async (issueId) => {
        try {
            await db.collection('issues').doc(issueId).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting issue:', error);
            return firestoreService.handleUnavailable(error, 'Unable to delete the report until Firestore is enabled in Firebase Console.');
        }
    },

    // Add note to issue
    addNote: async (issueId, noteText) => {
        try {
            const user = auth.currentUser;
            const note = {
                text: noteText,
                authorId: user.uid,
                authorEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('issues').doc(issueId).update({
                notes: firebase.firestore.FieldValue.arrayUnion(note),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error('Error adding note:', error);
            return firestoreService.handleUnavailable(error, 'Unable to add notes until Firestore is enabled in Firebase Console.');
        }
    },

    // Get statistics
    getStatistics: async () => {
        try {
            const snapshot = await db.collection('issues').get();
            
            const stats = {
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                high: 0,
                medium: 0,
                low: 0
            };

            snapshot.forEach(doc => {
                const data = doc.data();
                stats.total++;
                
                if (data.status === 'pending') stats.pending++;
                if (data.status === 'in-progress') stats.inProgress++;
                if (data.status === 'resolved') stats.resolved++;
                
                if (data.priority === 'high') stats.high++;
                if (data.priority === 'medium') stats.medium++;
                if (data.priority === 'low') stats.low++;
            });

            return { success: true, stats };
        } catch (error) {
            console.error('Error getting statistics:', error);
            return firestoreService.handleUnavailable(error, 'Statistics cannot load until Firestore is enabled in Firebase Console.');
        }
    }
};

window.firestoreService = firestoreService;