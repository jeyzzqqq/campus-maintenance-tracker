// User Dashboard Screen

const userDashboardScreen = {
    render: async () => {
        helpers.showLoading();

        const user = auth.currentUser;
        const result = await firestoreService.getUserIssues(user.uid);
        const issues = result.success ? result.issues : [];

        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <h2 class="text-xl font-semibold text-white mb-1">Welcome back!</h2>
                    <p class="text-green-100 text-sm">Here are your maintenance reports</p>
                </div>

                <div class="p-4 space-y-4 mt-4">
                    ${issues.length === 0 ? `
                        <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <span class="text-gray-400 block mb-4 mx-auto w-16 h-16">${helpers.icons.clipboard}</span>
                            <h3 class="text-gray-900 font-semibold mb-2">No Reports Yet</h3>
                            <p class="text-gray-500 text-sm">Tap the + button to report an issue</p>
                        </div>
                    ` : issues.map(issue => `
                        <div class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                            <div class="flex gap-4">
                                <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                    ${helpers.issueIcon(issue.icon)}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-gray-900 font-medium mb-1 truncate">${issue.title}</h3>
                                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span class="text-gray-400 w-4 h-4 inline-flex items-center justify-center">${helpers.icons.location}</span>
                                        <span class="truncate">${issue.location}</span>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        ${helpers.getStatusBadge(issue.status)}
                                        <span class="text-xs text-gray-400">${helpers.formatDate(issue.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button 
                    onclick="app.navigate('report')"
                    class="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 flex items-center justify-center text-2xl"
                >
                    ${helpers.icons.plus}
                </button>
            </div>
        `;
    }
};

window.userDashboardScreen = userDashboardScreen;