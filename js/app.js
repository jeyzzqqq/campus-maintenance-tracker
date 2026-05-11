// Main Application Controller

const app = {
    currentScreen: 'login',
    currentUser: null,
    currentRole: null,
    screenParams: null,

    init: () => {
        // Check if user is already logged in
        authService.onAuthStateChanged(async (user) => {
            if (user && !app.currentUser) {
                app.currentUser = user;
                const userData = await authService.getUserData(user.uid);
                app.currentRole = userData?.role || 'user';
                
                if (app.currentScreen === 'login') {
                    const screen = app.currentRole === 'admin' ? 'admin-dashboard' : 'dashboard';
                    app.navigate(screen);
                }
            } else if (!user && app.currentScreen !== 'login') {
                app.navigate('login');
            }
        });

        // Initial render
        app.navigate('login');
    },

    navigate: async (screen, params = null) => {
        app.currentScreen = screen;
        app.screenParams = params;

        const container = document.getElementById('screen-container');
        
        // Hide navigation for login and report screens
        const hideNavScreens = ['login', 'report', 'admin-detail'];
        if (hideNavScreens.includes(screen)) {
            appNavigation.hide();
        } else {
            appNavigation.show(app.currentRole, screen);
        }

        // Render appropriate screen
        let html = '';

        switch (screen) {
            case 'login':
                html = loginScreen.render();
                break;
            case 'dashboard':
                html = await userDashboardScreen.render();
                break;
            case 'report':
                html = reportIssueScreen.render();
                break;
            case 'profile':
                html = await profileScreen.render();
                break;
            case 'settings':
                html = settingsScreen.render();
                break;
            case 'admin-dashboard':
                html = await adminDashboardScreen.render();
                break;
            case 'admin-reports':
                html = await adminReportsScreen.render(params || 'all');
                break;
            case 'admin-detail':
                html = await adminDetailScreen.render(params);
                break;
            case 'admin-stats':
                html = await adminStatsScreen.render();
                break;
            default:
                html = '<div class="p-6 text-center">Screen not found</div>';
        }

        container.innerHTML = html;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', app.init);
} else {
    app.init();
}

window.app = app;