// Login Screen

const loginScreen = {
    render: () => {
        return `
            <div class="h-full flex flex-col justify-between p-6 screen-transition">
                <div class="flex-1 flex flex-col justify-center">
                    <div class="text-center mb-12">
                        <div class="w-20 h-20 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <span class="text-4xl">🏠</span>
                        </div>
                        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Campus Maintenance</h1>
                        <p class="text-gray-500">Track and report campus issues</p>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700 mb-2 font-medium">Login As</label>
                            <div class="grid grid-cols-2 gap-3 mb-4">
                                <button 
                                    id="role-user"
                                    onclick="loginScreen.selectRole('user')"
                                    class="py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all"
                                >
                                    <span class="text-2xl block mb-1">👤</span>
                                    <span class="text-sm">Student</span>
                                </button>
                                <button 
                                    id="role-admin"
                                    onclick="loginScreen.selectRole('admin')"
                                    class="py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all"
                                >
                                    <span class="text-2xl block mb-1">📋</span>
                                    <span class="text-sm">Staff</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-gray-700 mb-2 font-medium">Email</label>
                            <div class="relative">
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xl">📧</span>
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
                                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔒</span>
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
                                >👁️</button>
                            </div>
                        </div>

                        <button 
                            onclick="loginScreen.handleLogin()"
                            class="w-full bg-green-600 text-white py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors mt-6 font-medium"
                        >
                            <span id="login-btn-text">Sign In</span>
                        </button>

                        <button class="w-full text-green-600 py-2 font-medium">
                            Forgot Password?
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    selectedRole: 'user',

    selectRole: (role) => {
        loginScreen.selectedRole = role;
        const userBtn = document.getElementById('role-user');
        const adminBtn = document.getElementById('role-admin');
        const emailInput = document.getElementById('email-input');

        if (role === 'user') {
            userBtn.className = 'py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all';
            adminBtn.className = 'py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all';
            emailInput.placeholder = 'student@campus.edu';
        } else {
            userBtn.className = 'py-3 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all';
            adminBtn.className = 'py-3 px-4 rounded-xl border-2 border-green-600 bg-green-50 text-green-700 transition-all';
            emailInput.placeholder = 'staff@campus.edu';
        }
    },

    togglePassword: () => {
        const passwordInput = document.getElementById('password-input');
        const toggleBtn = document.getElementById('toggle-password');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
        }
    },

    handleLogin: async () => {
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        const loginBtnText = document.getElementById('login-btn-text');

        if (!email || !password) {
            helpers.showError('Please fill in all fields');
            return;
        }

        if (!helpers.validateEmail(email)) {
            helpers.showError('Please enter a valid email');
            return;
        }

        loginBtnText.textContent = 'Signing in...';

        const result = await authService.signIn(email, password);

        if (result.success) {
            const userData = await authService.getUserData(result.user.uid);
            const role = userData?.role || loginScreen.selectedRole;
            
            app.currentUser = result.user;
            app.currentRole = role;
            
            const screen = role === 'admin' ? 'admin-dashboard' : 'dashboard';
            app.navigate(screen);
        } else {
            loginBtnText.textContent = 'Sign In';
            helpers.showError(result.error || 'Login failed');
        }
    }
};

window.loginScreen = loginScreen;