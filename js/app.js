import { authService } from "./services/auth-service.js";
import { appNavigation } from "./components/navigation.js";
import { loginScreen } from "./screens/login-screen.js";
import { userDashboardScreen } from "./screens/userdashboard-screen.js";
import { reportIssueScreen } from "./screens/report-issue-screen.js";
import { userReportDetailScreen } from "./screens/user-report-detail-screen.js";
import { profileScreen } from "./screens/profile-screen.js";
import { settingsScreen } from "./screens/settings-screen.js";
import { adminDashboardScreen } from "./screens/admin-dashboard.js";
import { adminReportsScreen } from "./screens/admin-reports-screen.js";
import { adminDetailScreen } from "./screens/admin-detail-screen.js";
import { adminStatsScreen } from "./screens/admin-stats-screen.js";

// Main Application Controller

const app = {
    currentScreen: 'login',
    currentUser: null,
    currentRole: null,
    screenParams: null,
    isLoginInProgress: false, // Flag to prevent auto-navigation during login

    init: () => {
        // Check if user is already logged in
        authService.onAuthStateChanged(async (user) => {
            // Skip auto-navigation if a login is in progress
            if (app.isLoginInProgress) {
                console.log('Login in progress, skipping auto-navigation');
                return;
            }

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

        const adminScreens = ['admin-dashboard', 'admin-reports', 'admin-detail', 'admin-stats'];
        const userScreens = ['dashboard', 'report', 'profile', 'user-report'];
        const activeUser = app.currentUser || authService.getCurrentUser();

        if (screen !== 'login' && !activeUser) {
            screen = 'login';
            app.currentScreen = screen;
            app.screenParams = null;
        }

        // Prevent admins from accessing user screens
        if (userScreens.includes(screen) && app.currentRole === 'admin') {
            screen = 'admin-dashboard';
            app.currentScreen = screen;
            app.screenParams = null;
        }

        // Prevent users from accessing admin screens
        if (adminScreens.includes(screen) && app.currentRole !== 'admin') {
            screen = 'dashboard';
            app.currentScreen = screen;
            app.screenParams = null;
        }

        const container = document.getElementById('screen-container');
        
        // Hide navigation for login and detail screens
        const hideNavScreens = ['login', 'admin-detail', 'user-report'];
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
            case 'user-report':
                html = await userReportDetailScreen.render(params);
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

if (typeof window !== 'undefined') {
    window.app = app;
}