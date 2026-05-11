// Admin Reports Screen

const adminReportsScreen = {
    currentFilter: 'all',

    render: async (filter = 'all') => {
        helpers.showLoading();
        adminReportsScreen.currentFilter = filter;

        const result = await firestoreService.getAllIssues();
        let issues = result.success ? result.issues : [];

        if (filter !== 'all') {
            issues = issues.filter(i => i.status === filter);
        }

        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <h2 class="text-xl font-semibold text-white mb-4">All Reports</h2>

                    <!-- Filter Tabs -->
                    <div class="flex gap-2 overflow-x-auto">
                        ${['all', 'pending', 'in-progress', 'resolved'].map(f => `
                            <button 
                                onclick="app.navigate('admin-reports', '${f}')"
                                class="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                                    filter === f 
                                        ? 'bg-white text-green-600' 
                                        : 'bg-green-500 text-white hover:bg-green-400'
                                }"
                            >
                                ${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="p-4 space-y-3 mt-4">
                    ${issues.length === 0 ? `
                        <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <span class="text-6xl block mb-4">📋</span>
                            <h3 class="text-gray-900 font-semibold mb-2">No Reports</h3>
                            <p class="text-gray-500 text-sm">No ${filter === 'all' ? '' : filter} reports found</p>
                        </div>
                    ` : issues.map(issue => `
                        <div 
                            onclick="app.navigate('admin-detail', '${issue.id}')"
                            class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div class="flex gap-4">
                                <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                    ${issue.icon || '🔧'}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-gray-900 font-medium mb-1 truncate">${issue.title}</h4>
                                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span>📍</span>
                                        <span class="truncate">${issue.location}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mb-2">
                                        ${helpers.getStatusBadge(issue.status)}
                                        ${helpers.getPriorityBadge(issue.priority)}
                                    </div>
                                    <p class="text-xs text-gray-400">Reported by: ${issue.userEmail}</p>
                                </div>
                                <span class="text-2xl text-gray-400 flex-shrink-0 self-center">›</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

window.adminReportsScreen = adminReportsScreen;