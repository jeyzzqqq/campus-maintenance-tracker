// Firebase configuration helper
// --------------------------------
// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Enable Authentication (Email/Password), Firestore, and Storage
// 3) In Project Settings -> Your apps -> Add web app (</>) and copy
//    the config object into the `firebaseConfig` below.
// IMPORTANT: Do NOT commit production credentials to a public repo.
//            Add this file to .gitignore or replace real values at
//            runtime using environment-specific deployment steps.

// Paste the config object you copied from Firebase here:
// Example:
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "your-app.firebaseapp.com",
//   projectId: "your-app-id",
//   storageBucket: "your-app.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdef",
//   measurementId: "G-XXXXXXX" // optional
// };

export const firebaseConfig = {
	// Firebase config provided by the user
	apiKey: "AIzaSyBCEE-avgr-Ax1sUPP0OJ59247_juwq3hk",
	authDomain: "maintenance-tracker-4fdae.firebaseapp.com",
	projectId: "maintenance-tracker-4fdae",
	storageBucket: "maintenance-tracker-4fdae.firebasestorage.app",
	messagingSenderId: "707735201855",
	appId: "1:707735201855:web:be943d392b3ffab3c6b08a",
	measurementId: "G-DRFSWEWZ72"
};

// Example initialization (two common approaches):

// 1) Modular SDK (ES modules / bundlers)
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// 2) CDN / Compat usage (include Firebase <script> tags in index.html)
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"></script>
// Then in JS:
// if (window.firebase && window.firebase.initializeApp) {
//   if (!window.firebase.apps || !window.firebase.apps.length) {
//     window.firebase.initializeApp(firebaseConfig);
//   }
//   export const auth = window.firebase.auth();
//   export const db = window.firebase.firestore();
//   export const storage = window.firebase.storage();
// }

// Helper: small runtime check for a compat-style global firebase.
export function initCompatFirebaseIfPresent() {
	if (typeof window === 'undefined') return null;
	const fb = window.firebase;
	if (!fb || !fb.initializeApp) return null;
	if (!fb.apps || !fb.apps.length) fb.initializeApp(firebaseConfig);
	return fb;
}

// Quick reminder of Firebase setup steps:
// - Create project, enable Authentication (Email/Password)
// - Create Firestore database (start in production mode)
// - Enable Storage
// - Add a web app and paste the config above

// If the compat SDK scripts are present (included via CDN in index.html),
// initialize and expose globals to keep existing service code working.
if (typeof window !== 'undefined' && window.firebase && window.firebase.initializeApp) {
	if (!window.firebase.apps || !window.firebase.apps.length) {
		window.firebase.initializeApp(firebaseConfig);
	}
	// Expose compat-style globals expected by existing services
	try {
		window.auth = window.firebase.auth();
		window.db = window.firebase.firestore();
		window.storage = window.firebase.storage();
	} catch (e) {
		/* ignore if methods not available */
	}
}

