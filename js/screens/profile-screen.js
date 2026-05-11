// Profile Screen

const profileScreen = {
    render: async () => {
        helpers.showLoading();

        const user = auth.currentUser;
        const result = await firestoreService.getUserIssues(user.uid);
        const issues = result.success ? result.issues : [];

        const totalReports = issues.length;
        const resolvedReports = issues.filter(i => i.status === 'resolved').length;
        const pendingReports = issues.filter(i => i.status === 'pending').length;

        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <div class="flex flex-col items-center">
                        <div class="w-24 h-24 bg-white rounded-full mb-4 flex items-center justify-center text-5xl">
                            <span class="text-green-600">${helpers.icons.user}</span>
                        </div>
                        <h2 class="text-xl font-semibold text-white mb-1">${user.email.split('@')[0]}</h2>
                        <p class="text-green-100 text-sm">${user.email}</p>
                    </div>
                </div>

                <div class="p-6">
                    <div class="bg-white rounded-2xl shadow-sm p-4 mb-6">
                        <div class="grid grid-cols-3 divide-x divide-gray-200">
                            <div class="text-center">
                                <p class="text-2xl font-semibold text-gray-900 mb-1">${totalReports}</p>
                                <p class="text-sm text-gray-500">Total</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-semibold text-green-600 mb-1">${resolvedReports}</p>
                                <p class="text-sm text-gray-500">Resolved</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-semibold text-amber-600 mb-1">${pendingReports}</p>
                                <p class="text-sm text-gray-500">Pending</p>
                            </div>
                        </div>
                    </div>

                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                    <div class="space-y-3">
                        ${issues.slice(0, 3).map(issue => `
                            <div class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                                        ${helpers.issueIcon(issue.icon)}
                                    </div>
                                    <div>
                                        <p class="text-gray-900 text-sm font-medium mb-1">${issue.title}</p>
                                        ${helpers.getStatusBadge(issue.status)}
                                    </div>
                                </div>
                                <span class="text-gray-400">${helpers.icons.arrowRight}</span>
                            </div>
                        `).join('')}
                        ${issues.length === 0 ? `
                            <div class="bg-white rounded-xl shadow-sm p-8 text-center">
                                <span class="text-gray-400 block mb-2 mx-auto w-10 h-10">${helpers.icons.clipboard}</span>
                                <p class="text-gray-500 text-sm">No reports yet</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
};

window.profileScreen = profileScreen;