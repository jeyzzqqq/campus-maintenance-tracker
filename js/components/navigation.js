import { helpers } from "../utils/helpers.js";

// Navigation Component

export const appNavigation = {
    // Render user navigation
    renderUserNav: (currentScreen) => {
        const navItems = [
            { id: 'dashboard', icon: helpers.icons.home, label: 'Home' },
            { id: 'report', icon: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M9 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2h-2m0 0V1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1m0 0h3v3H9V2z"/></svg>`, label: 'Report' },
            { id: 'profile', icon: helpers.icons.user, label: 'Profile' },
            { id: 'settings', icon: helpers.icons.settings, label: 'Settings' }
        ];

        return navItems.map(item => `
            <button 
                onclick="app.navigate('${item.id}')" 
                class="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[11px] leading-none ${currentScreen === item.id ? 'text-green-600 font-medium' : 'text-gray-400'}"
            >
                <span class="flex h-5 w-5 items-center justify-center ${currentScreen === item.id ? 'text-green-600' : 'text-gray-400'}">${item.icon}</span>
                <span class="text-xs">${item.label}</span>
            </button>
        `).join('');
    },

    // Render admin navigation
    renderAdminNav: (currentScreen) => {
        const navItems = [
            { id: 'admin-dashboard', icon: helpers.icons.home, label: 'Dashboard' },
            { id: 'admin-reports', icon: helpers.icons.reports, label: 'Reports' },
            { id: 'admin-stats', icon: helpers.icons.stats, label: 'Stats' },
            { id: 'settings', icon: helpers.icons.settings, label: 'Settings' }
        ];

        return navItems.map(item => `
            <button 
                onclick="app.navigate('${item.id}')" 
                class="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[11px] leading-none ${currentScreen === item.id ? 'text-green-600 font-medium' : 'text-gray-400'}"
            >
                <span class="flex h-5 w-5 items-center justify-center ${currentScreen === item.id ? 'text-green-600' : 'text-gray-400'}">${item.icon}</span>
                <span class="text-xs">${item.label}</span>
            </button>
        `).join('');
    },

    // Show navigation
    show: (role, currentScreen) => {
        const navContainer = document.getElementById('bottom-nav');
        navContainer.classList.remove('hidden');
        navContainer.innerHTML = role === 'admin' 
            ? appNavigation.renderAdminNav(currentScreen)
            : appNavigation.renderUserNav(currentScreen);
    },

    // Hide navigation
    hide: () => {
        const navContainer = document.getElementById('bottom-nav');
        navContainer.classList.add('hidden');
    }
};

if (typeof window !== 'undefined') {
    window.appNavigation = appNavigation;
}
