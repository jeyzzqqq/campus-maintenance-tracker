// Cleanup script for fixing corrupted location fields in Firestore
// Run this in the browser console after opening the app

import { db } from "./js/config/firebase-config.js";
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const cleanupLocations = async () => {
    try {
        console.log('Starting location cleanup...');
        const issuesRef = collection(db, 'issues');
        const snapshot = await getDocs(issuesRef);
        
        let fixed = 0;
        
        for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            
            // Check if location contains "undefined"
            if (data.location && typeof data.location === 'string' && data.location.includes('undefined')) {
                console.log(`Found corrupted location: "${data.location}"`);
                
                // Remove "undefined" from the string
                let cleanLocation = data.location.replace('undefined', '').trim();
                
                // If result is empty, mark it as not specified
                if (!cleanLocation || cleanLocation === '-' || cleanLocation === '') {
                    cleanLocation = '(Location not specified)';
                }
                
                // Update the document
                await updateDoc(doc(db, 'issues', docSnap.id), {
                    location: cleanLocation
                });
                
                console.log(`✓ Fixed: "${data.location}" → "${cleanLocation}"`);
                fixed++;
            }
        }
        
        console.log(`Cleanup complete! Fixed ${fixed} records.`);
        alert(`Location cleanup complete! Fixed ${fixed} corrupted records. Please refresh the page.`);
        
        return fixed;
    } catch (error) {
        console.error('Cleanup error:', error);
        alert('Error during cleanup: ' + error.message);
    }
};

// Make it available in console
if (typeof window !== 'undefined') {
    window.cleanupLocations = cleanupLocations;
}
