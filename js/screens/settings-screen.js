import { helpers } from "../utils/helpers.js";
import { authService } from "../services/auth-service.js";

// Settings Screen

export const settingsScreen = {
    render: () => {
        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <h2 class="text-xl font-semibold text-white mb-1">Settings</h2>
                    <p class="text-green-100 text-sm">Manage app preferences</p>
                </div>

                <div class="p-4 space-y-4 mt-4">
                    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <h3 class="text-lg font-semibold text-gray-900 px-4 pt-4 pb-3">About</h3>
                        <div class="divide-y divide-gray-100">
                            <button class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <span class="text-gray-900 text-sm">Terms of Service</span>
                                <span class="text-gray-400">${helpers.icons.arrowRight}</span>
                            </button>
                            <button class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <span class="text-gray-900 text-sm">Privacy Policy</span>
                                <span class="text-gray-400">${helpers.icons.arrowRight}</span>
                            </button>
                            <div class="px-4 py-3">
                                <p class="text-gray-500 text-xs">Version 1.0.0</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onclick="settingsScreen.handleSignOut()"
                        class="w-full bg-red-50 text-red-600 py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                        <span class="w-5 h-5">${helpers.icons.signOut}</span>
                        Sign Out
                    </button>
                </div>
            </div>
        `;
    },

    handleSignOut: async () => {
        const result = await authService.signOut();
        if (result.success) {
            app.currentUser = null;
            app.currentRole = null;
            app.navigate('login');
        } else {
            helpers.showError('Failed to sign out');
        }
    }
};

if (typeof window !== 'undefined') {
    window.settingsScreen = settingsScreen;
}
