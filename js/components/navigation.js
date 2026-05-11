// Navigation Component

const appNavigation = {
    // Render user navigation
    renderUserNav: (currentScreen) => {
        const navItems = [
            { id: 'dashboard', icon: '🏠', label: 'Home' },
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];

        return navItems.map(item => `
            <button 
                onclick="app.navigate('${item.id}')" 
                class="flex flex-col items-center gap-1 ${currentScreen === item.id ? 'text-green-600' : 'text-gray-400'}"
            >
                <span class="text-2xl">${item.icon}</span>
                <span class="text-xs">${item.label}</span>
            </button>
        `).join('');
    },

    // Render admin navigation
    renderAdminNav: (currentScreen) => {
        const navItems = [
            { id: 'admin-dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'admin-reports', icon: '📋', label: 'Reports' },
            { id: 'admin-stats', icon: '📊', label: 'Stats' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
        ];

        return navItems.map(item => `
            <button 
                onclick="app.navigate('${item.id}')" 
                class="flex flex-col items-center gap-1 ${currentScreen === item.id ? 'text-green-600' : 'text-gray-400'}"
            >
                <span class="text-2xl">${item.icon}</span>
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

window.appNavigation = appNavigation;
