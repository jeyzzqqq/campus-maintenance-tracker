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
    isAuthResolved: false,
    themeStorageKey: 'maintenancetracker-theme',

    getTheme: () => {
        const storedTheme = localStorage.getItem(app.themeStorageKey);
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }

        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    applyTheme: (theme, persist = true) => {
        const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
        if (persist) {
            localStorage.setItem(app.themeStorageKey, resolvedTheme);
        }
        document.documentElement.classList.toggle('dark-mode', resolvedTheme === 'dark');
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        return resolvedTheme;
    },

    toggleTheme: () => {
        const nextTheme = app.getTheme() === 'dark' ? 'light' : 'dark';
        const appliedTheme = app.applyTheme(nextTheme);

        if (app.currentScreen) {
            app.navigate(app.currentScreen, app.screenParams);
        }

        return appliedTheme;
    },

    init: () => {
        app.applyTheme(app.getTheme(), false);

        const container = document.getElementById('screen-container');
        if (container) {
            container.innerHTML = `
                <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                    <div class="text-center">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-sm text-gray-500">Loading your session...</p>
                    </div>
                </div>
            `;
        }
        appNavigation.hide();

        // Check if user is already logged in
        authService.onAuthStateChanged(async (user) => {
            // Skip auto-navigation if a login is in progress
            if (app.isLoginInProgress) {
                console.log('Login in progress, skipping auto-navigation');
                return;
            }

            // First auth resolution on refresh/app load.
            // Always show login screen - no auto-navigation
            if (!app.isAuthResolved) {
                app.isAuthResolved = true;

                if (user) {
                    app.currentUser = user;
                    const userData = await authService.getUserData(user.uid);
                    app.currentRole = userData?.role || 'user';
                    // Don't auto-navigate - always show login
                    app.navigate('login');
                } else {
                    app.currentUser = null;
                    app.currentRole = null;
                    app.navigate('login');
                }

                return;
            }

            if (user && !app.currentUser) {
                app.currentUser = user;
                const userData = await authService.getUserData(user.uid);
                app.currentRole = userData?.role || 'user';
                
                // Don't auto-navigate - stay on current screen
                // User must manually click Sign In
            } else if (!user) {
                app.currentUser = null;
                app.currentRole = null;

                if (app.currentScreen !== 'login') {
                    app.navigate('login');
                }
            }
        });
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

        if (screen === 'login') {
            app.applyTheme('light', false);
        } else {
            app.applyTheme(app.getTheme(), false);
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
                html = await reportIssueScreen.render(params);
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