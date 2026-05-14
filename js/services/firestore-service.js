import {
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	orderBy,
	where,
	serverTimestamp,
	setDoc,
	updateDoc,
	deleteDoc,
	addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "../config/firebase-config.js";
import { storageService } from "../services/storage-service.js";

// Firestore Database Service

export const firestoreService = {
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
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'issues'), issue);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error creating issue:', error);
            return firestoreService.handleUnavailable(error, 'Unable to save the report right now. Firestore needs to be enabled in Firebase Console.');
        }
    },

    // Get all issues
    getAllIssues: async () => {
        try {
            const snapshot = await getDocs(query(collection(db, 'issues'), orderBy('createdAt', 'desc')));

            const issues = [];
            snapshot.forEach(issueDoc => {
                issues.push({ id: issueDoc.id, ...issueDoc.data() });
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
            const snapshot = await getDocs(query(collection(db, 'issues'), where('userId', '==', userId), orderBy('createdAt', 'desc')));

            const issues = [];
            snapshot.forEach(issueDoc => {
                issues.push({ id: issueDoc.id, ...issueDoc.data() });
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
            const snapshot = await getDocs(query(collection(db, 'issues'), where('status', '==', status), orderBy('createdAt', 'desc')));

            const issues = [];
            snapshot.forEach(issueDoc => {
                issues.push({ id: issueDoc.id, ...issueDoc.data() });
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
            const issueDoc = await getDoc(doc(db, 'issues', issueId));
            if (!issueDoc.exists()) {
                return { success: false, error: 'Issue not found' };
            }
            return { success: true, issue: { id: issueDoc.id, ...issueDoc.data() } };
        } catch (error) {
            console.error('Error getting issue:', error);
            return firestoreService.handleUnavailable(error, 'This report cannot load until Firestore is enabled in Firebase Console.');
        }
    },

    // Update issue
    updateIssue: async (issueId, updateData) => {
        try {
            await updateDoc(doc(db, 'issues', issueId), {
                ...updateData,
                updatedAt: serverTimestamp()
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
            const issueResult = await firestoreService.getIssue(issueId);
            if (issueResult.success && issueResult.issue) {
                const issue = issueResult.issue;

                if (issue.imageStorageDocId) {
                    await deleteDoc(doc(db, 'issueImages', issue.imageStorageDocId));
                }

                if (issue.imageUrl) {
                    await storageService.deleteImage(issue.imageUrl);
                }
            }

            await deleteDoc(doc(db, 'issues', issueId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting issue:', error);
            return firestoreService.handleUnavailable(error, 'Unable to delete the report until Firestore is enabled in Firebase Console.');
        }
    },

    // Cleanup an image record when a report is updated or deleted
    deleteIssueImageCleanup: async (imageUrl, imageStorageDocId) => {
        try {
            if (imageStorageDocId) {
                await deleteDoc(doc(db, 'issueImages', imageStorageDocId));
            }

            if (imageUrl) {
                await storageService.deleteImage(imageUrl);
            }

            return { success: true };
        } catch (error) {
            console.error('Error cleaning up issue image:', error);
            return firestoreService.handleUnavailable(error, 'Unable to remove the old image right now.');
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
                createdAt: serverTimestamp()
            };

            await updateDoc(doc(db, 'issues', issueId), {
                notes: arrayUnion(note),
                updatedAt: serverTimestamp()
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
            const snapshot = await getDocs(collection(db, 'issues'));

            const stats = {
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                high: 0,
                medium: 0,
                low: 0
            };

            snapshot.forEach(issueDoc => {
                const data = issueDoc.data();
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

if (typeof window !== 'undefined') {
	window.firestoreService = firestoreService;
}