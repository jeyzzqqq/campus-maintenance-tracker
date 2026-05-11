import { helpers } from "../utils/helpers.js";
import { authService } from "../services/auth-service.js";

// Login Screen

export const loginScreen = {
    mode: 'login',
    selectedRole: 'user',

    icons: {
        home: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10 text-white">
                <path fill="currentColor" d="M12 3.2 3 10.4V21h6.5v-6.1h5V21H21V10.4L12 3.2Zm0 2.6 7 5.6V19h-3.5v-6.1h-7V19H5V11.4l7-5.6Z"/>
            </svg>
        `,
        user: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M12 12.2a4.5 4.5 0 1 0-4.5-4.5 4.5 4.5 0 0 0 4.5 4.5Zm0 2.3c-4.2 0-7.8 2.6-7.8 5.8V22h15.6v-1.7c0-3.2-3.6-5.8-7.8-5.8Z"/>
            </svg>
        `,
        staff: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M10 3h4v2h5v4h-2v12H7V9H5V5h5V3Zm-1 6v10h6V9H9Zm1-4v2h4V5H10Z"/>
            </svg>
        `,
        email: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.1V17h16V8.1l-8 5.4-8-5.4Zm14.7-1.1H5.3L12 11.5l6.7-4.5Z"/>
            </svg>
        `,
        lock: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2Zm-8-2a3 3 0 1 1 6 0v2H9V7Zm3 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
            </svg>
        `,
        eye: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M12 5c-5.5 0-9.8 4.1-11 7 1.2 2.9 5.5 7 11 7s9.8-4.1 11-7c-1.2-2.9-5.5-7-11-7Zm0 11.2A4.2 4.2 0 1 1 12 8.8a4.2 4.2 0 0 1 0 8.4Zm0-2.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
            </svg>
        `,
        eyeOff: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="currentColor" d="M2.3 4.9 3.7 3.5l16.8 16.8-1.4 1.4-2.2-2.2c-1.5.8-3.3 1.2-4.9 1.2-5.5 0-9.8-4.1-11-7 .7-1.7 2.4-4 5-5.7L2.3 4.9Zm7 7a2 2 0 0 0 2.8 2.8l-2.8-2.8Zm2.7-5.6a4.2 4.2 0 0 1 4.2 4.2c0 .5-.1 1-.3 1.5l-1.7-1.7a2 2 0 0 0-2.6-2.6l-1.7-1.7c.6-.2 1.2-.3 1.8-.3Zm6.3 2.1-2.4 2.4c0 3.7-3.1 6.8-6.8 6.8-.5 0-1-.1-1.5-.2L6.5 12c1.2-2 3.7-3.7 6.5-3.7.8 0 1.5.1 2.3.4l2.5-2.5 1.5 1.2Z"/>
            </svg>
        `,
        google: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5">
                <path fill="#EA4335" d="M12 10.3v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2A6.4 6.4 0 1 1 12 5.6c1.8 0 3 .8 3.7 1.5l2.5-2.4A10 10 0 1 0 12 22c5.7 0 9.5-4 9.5-9.7 0-.7-.1-1.2-.2-1.8H12Z"/>
                <path fill="#4285F4" d="M22 12.3c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.2 1.1-1 2.3-2.2 3l3.4 2.6C20.8 18.3 22 15.7 22 12.3Z"/>
                <path fill="#FBBC05" d="M5.3 14.2a6.4 6.4 0 0 1 0-4.4L1.8 7.2a10 10 0 0 0 0 9.6l3.5-2.6Z"/>
                <path fill="#34A853" d="m12 22c2.7 0 5-.9 6.6-2.4l-3.4-2.6c-.9.6-2 .9-3.2.9a6.4 6.4 0 0 1-6.1-4.5l-3.5 2.6A10 10 0 0 0 12 22Z"/>
            </svg>
        `,
        arrowRight: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-4">
                <path fill="currentColor" d="m13.2 5 6 7-6 7-1.5-1.3 3.7-4.4H5v-2h10.4l-3.7-4.3L13.2 5Z"/>
            </svg>
        `,
        spark: `
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-4">
                <path fill="currentColor" d="m12 2 1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2Zm7 10 1 2.7 2.7 1-2.7 1L19 19l-1-2.3-2.7-1L18 14l1-2.7ZM5 14l1.1 3 3 1.1-3 1.1L5 22l-1.1-2.8-3-1.1 3-1.1L5 14Z"/>
            </svg>
        `
    },

    render: () => {
        return `
            <div class="h-full flex flex-col p-5 screen-transition bg-gradient-to-b from-emerald-50 via-white to-slate-50">
                <div class="flex-1 flex flex-col justify-center">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-green-600 rounded-[1.4rem] mx-auto mb-4 flex items-center justify-center shadow-lg">
                            ${loginScreen.icons.home}
                        </div>
                        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Campus Maintenance</h1>
                        <p class="text-gray-500">Track and report campus issues</p>
                    </div>

                    <form class="space-y-4" onsubmit="loginScreen.handlePrimaryAction(event)">
                        <div>
                            <label class="block text-gray-700 mb-2 font-medium">Login As</label>
                            <div class="grid grid-cols-2 gap-3 mb-4">
                                <button 
                                    id="role-user"
                                    onclick="loginScreen.selectRole('user')"
                                    class="py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all"
                                >
                                    <span class="block mb-1 text-green-700 flex justify-center">${loginScreen.icons.user}</span>
                                    <span class="text-sm">Student</span>
                                </button>
                                <button 
                                    id="role-admin"
                                    onclick="loginScreen.selectRole('admin')"
                                    class="py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all"
                                >
                                    <span class="block mb-1 text-gray-600 flex justify-center">${loginScreen.icons.staff}</span>
                                    <span class="text-sm">Staff</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            onclick="loginScreen.handleGoogleSignIn()"
                            type="button"
                            class="w-full bg-white text-gray-800 py-3 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3"
                        >
                            <span class="flex items-center justify-center">${loginScreen.icons.google}</span>
                            <span>Continue with Google</span>
                        </button>

                        <div>
                            <label class="block text-gray-700 mb-2 font-medium">Email</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${loginScreen.icons.email}</span>
                                <input 
                                    id="email-input"
                                    type="email" 
                                    placeholder="student@campus.edu"
                                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label class="block text-gray-700 mb-2 font-medium">Password</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${loginScreen.icons.lock}</span>
                                <input 
                                    id="password-input"
                                    type="password" 
                                    placeholder="••••••••"
                                    class="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button 
                                    id="toggle-password"
                                    onclick="loginScreen.togglePassword()"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
                                >${loginScreen.icons.eye}</button>
                            </div>
                        </div>

                        <div id="confirm-password-wrap" class="hidden">
                            <label class="block text-gray-700 mb-2 font-medium">Confirm Password</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${loginScreen.icons.lock}</span>
                                <input 
                                    id="confirm-password-input"
                                    type="password" 
                                    placeholder="••••••••"
                                    class="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <button 
                            id="primary-action-btn"
                            type="submit"
                            class="w-full bg-green-600 text-white py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors mt-6 font-medium"
                        >
                            <span id="login-btn-text">Sign In</span>
                        </button>

                        <button 
                            id="toggle-create-account"
                            type="button"
                            onclick="loginScreen.setMode(loginScreen.mode === 'signup' ? 'login' : 'signup')"
                            class="w-full text-green-600 py-2 font-medium text-sm"
                        >
                            Create Account
                        </button>

                        <div class="flex items-center justify-between gap-3">
                            <button type="button" class="text-green-600 py-2 font-medium text-sm" onclick="loginScreen.handleForgotPassword()">
                                Forgot Password?
                            </button>
                            <button type="button" class="text-gray-500 py-2 font-medium text-sm" onclick="loginScreen.togglePasswordVisibility()">
                                Show Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    setMode: (mode) => {
        loginScreen.mode = mode;
        const confirmWrap = document.getElementById('confirm-password-wrap');
        const actionText = document.getElementById('login-btn-text');
        const primaryButton = document.getElementById('primary-action-btn');
        const createAccountToggle = document.getElementById('toggle-create-account');

        if (mode === 'signup') {
            if (confirmWrap) confirmWrap.classList.remove('hidden');
            if (actionText) actionText.textContent = 'Create Account';
            if (primaryButton) {
                primaryButton.classList.remove('bg-green-600', 'hover:bg-green-700');
                primaryButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
            }
            if (createAccountToggle) createAccountToggle.textContent = 'Already have an account? Sign In';
        } else {
            if (confirmWrap) confirmWrap.classList.add('hidden');
            if (actionText) actionText.textContent = 'Sign In';
            if (primaryButton) {
                primaryButton.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                primaryButton.classList.add('bg-green-600', 'hover:bg-green-700');
            }
            if (createAccountToggle) createAccountToggle.textContent = 'Create Account';
        }
    },

    selectRole: (role) => {
        loginScreen.selectedRole = role;
        const userBtn = document.getElementById('role-user');
        const adminBtn = document.getElementById('role-admin');
        const emailInput = document.getElementById('email-input');

        if (role === 'user') {
            if (userBtn) userBtn.className = 'py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all';
            if (adminBtn) adminBtn.className = 'py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all';
            if (emailInput) emailInput.placeholder = 'student@campus.edu';
        } else {
            if (userBtn) userBtn.className = 'py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all';
            if (adminBtn) adminBtn.className = 'py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all';
            if (emailInput) emailInput.placeholder = 'staff@campus.edu';
        }
    },

    togglePassword: () => {
        const passwordInput = document.getElementById('password-input');
        const toggleBtn = document.getElementById('toggle-password');
        if (!passwordInput || !toggleBtn) return;

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.innerHTML = loginScreen.icons.eyeOff;
        } else {
            passwordInput.type = 'password';
            toggleBtn.innerHTML = loginScreen.icons.eye;
        }
    },

    togglePasswordVisibility: () => {
        loginScreen.togglePassword();
    },

    handleForgotPassword: async () => {
        const email = document.getElementById('email-input').value.trim();

        if (!email) {
            helpers.showError('Enter your email first');
            return;
        }

        if (!helpers.validateEmail(email)) {
            helpers.showError('Please enter a valid email');
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);
            helpers.showSuccess('Password reset email sent');
        } catch (error) {
            helpers.showError(error.message || 'Unable to send password reset email');
        }
    },

    setLoading: (isLoading, text) => {
        const button = document.getElementById('primary-action-btn');
        const buttonText = document.getElementById('login-btn-text');
        const googleButton = document.querySelector('button[onclick="loginScreen.handleGoogleSignIn()"]');
        const toggleCreateButton = document.getElementById('toggle-create-account');
        if (!button || !buttonText) return;
        button.disabled = isLoading;
        if (googleButton) googleButton.disabled = isLoading;
        if (toggleCreateButton) toggleCreateButton.disabled = isLoading;
        button.classList.toggle('opacity-75', isLoading);
        buttonText.textContent = text;
    },

    handlePrimaryAction: async (event) => {
        if (event) {
            event.preventDefault();
        }

        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const confirmPasswordInput = document.getElementById('confirm-password-input');

        if (!email || !password) {
            helpers.showError('Please fill in all fields');
            return;
        }

        if (!helpers.validateEmail(email)) {
            helpers.showError('Please enter a valid email');
            return;
        }

        if (loginScreen.mode === 'signup') {
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
            if (!confirmPassword) {
                helpers.showError('Please confirm your password');
                return;
            }
            if (password !== confirmPassword) {
                helpers.showError('Passwords do not match');
                return;
            }
        }

        loginScreen.setLoading(true, loginScreen.mode === 'signup' ? 'Creating account...' : 'Signing in...');

        const result = loginScreen.mode === 'signup'
            ? await authService.signUp(email, password, loginScreen.selectedRole)
            : await authService.signIn(email, password);

        if (result.success) {
            const userData = await authService.getUserData(result.user.uid);
            const role = result.role || userData?.role || loginScreen.selectedRole;

            const passwordField = document.getElementById('password-input');
            if (passwordField) passwordField.value = '';
            const confirmPasswordField = document.getElementById('confirm-password-input');
            if (confirmPasswordField) confirmPasswordField.value = '';
            
            app.currentUser = result.user;
            app.currentRole = role;
            
            loginScreen.setMode('login');
            const screen = role === 'admin' ? 'admin-dashboard' : 'dashboard';
            app.navigate(screen);
        } else {
            loginScreen.setLoading(false, loginScreen.mode === 'signup' ? 'Create Account' : 'Sign In');
            helpers.showError(result.error || 'Login failed');
        }
    },

    handleGoogleSignIn: async () => {
        loginScreen.setLoading(true, 'Signing in with Google...');

        const result = await authService.signInWithGoogle();

        if (result.success) {
            const userData = await authService.getUserData(result.user.uid);
            const role = userData?.role || result.role || 'user';

            const passwordField = document.getElementById('password-input');
            if (passwordField) passwordField.value = '';
            const confirmPasswordField = document.getElementById('confirm-password-input');
            if (confirmPasswordField) confirmPasswordField.value = '';

            app.currentUser = result.user;
            app.currentRole = role;

            loginScreen.setMode('login');
            app.navigate(role === 'admin' ? 'admin-dashboard' : 'dashboard');
        } else {
            loginScreen.setLoading(false, loginScreen.mode === 'signup' ? 'Create Account' : 'Sign In');
            helpers.showError(result.error || 'Google sign-in failed');
        }
    }
};

if (typeof window !== 'undefined') {
    window.loginScreen = loginScreen;
}