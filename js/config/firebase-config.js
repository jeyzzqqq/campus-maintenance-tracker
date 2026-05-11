import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase configuration
// 1) Create a Firebase project in the console.
// 2) Enable Authentication, Firestore, and Storage.
// 3) Add a web app and paste its config below.

export const firebaseConfig = {
	apiKey: "AIzaSyBCEE-avgr-Ax1sUPP0OJ59247_juwq3hk",
	authDomain: "maintenance-tracker-4fdae.firebaseapp.com",
	projectId: "maintenance-tracker-4fdae",
	storageBucket: "maintenance-tracker-4fdae.firebasestorage.app",
	messagingSenderId: "707735201855",
	appId: "1:707735201855:web:be943d392b3ffab3c6b08a",
	measurementId: "G-DRFSWEWZ72"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

let analytics = null;
try {
	analytics = getAnalytics(firebaseApp);
} catch (error) {
	analytics = null;
}

setPersistence(auth, browserLocalPersistence).catch(() => {});

export { analytics };

if (typeof window !== 'undefined') {
	window.firebaseApp = firebaseApp;
	window.firebaseConfig = firebaseConfig;
	window.auth = auth;
	window.db = db;
	window.storage = storage;
	window.analytics = analytics;
}

