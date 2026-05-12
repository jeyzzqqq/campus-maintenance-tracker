import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";

// Admin Dashboard Screen

export const adminDashboardScreen = {
    render: async () => {
        helpers.showLoading();

        const result = await firestoreService.getAllIssues();
        const issues = result.success ? result.issues : [];

        const pending = issues.filter(i => i.status === 'pending').length;
        const inProgress = issues.filter(i => i.status === 'in-progress').length;
        const resolved = issues.filter(i => i.status === 'resolved').length;

        const highPriorityIssues = issues.filter(i => i.priority === 'high' && i.status !== 'resolved');

        return `
            <div class="min-h-full bg-gray-50 pb-32 screen-transition">
                <div class="bg-green-600 text-white px-5 pt-6 pb-5 rounded-b-[2rem] shadow-md">
                    <h2 class="text-[1.05rem] font-semibold text-white mb-1">Maintenance Dashboard</h2>
                    <p class="text-green-100 text-[0.82rem] leading-tight">Monitor and manage all reports</p>
                </div>

                <div class="px-4 pt-4 space-y-4">
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-3 gap-2.5">
                        <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                            <div class="w-9 h-9 bg-amber-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                                <span class="text-amber-700">${helpers.icons.clock}</span>
                            </div>
                            <p class="text-[1.35rem] font-semibold text-gray-900 leading-none mb-1">${pending}</p>
                            <p class="text-[0.72rem] text-gray-500">Pending</p>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                            <div class="w-9 h-9 bg-blue-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                                <span class="text-blue-700">${helpers.icons.settings}</span>
                            </div>
                            <p class="text-[1.35rem] font-semibold text-gray-900 leading-none mb-1">${inProgress}</p>
                            <p class="text-[0.72rem] text-gray-500">In Progress</p>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm p-3 text-center">
                            <div class="w-9 h-9 bg-green-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                                <span class="text-green-700">${helpers.icons.check}</span>
                            </div>
                            <p class="text-[1.35rem] font-semibold text-gray-900 leading-none mb-1">${resolved}</p>
                            <p class="text-[0.72rem] text-gray-500">Resolved</p>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-base font-semibold text-gray-900 mb-3">Quick Actions</h3>
                        <div class="grid grid-cols-2 gap-3">
                            <button 
                                onclick="app.navigate('admin-reports')"
                                class="bg-green-50 text-green-700 py-3 px-3 rounded-2xl hover:bg-green-100 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <span class="text-green-700">${helpers.icons.reports}</span>
                                <span class="text-sm">All Reports</span>
                            </button>
                            <button 
                                onclick="app.navigate('admin-stats')"
                                class="bg-blue-50 text-blue-700 py-3 px-3 rounded-2xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <span class="text-blue-700">${helpers.icons.stats}</span>
                                <span class="text-sm">Statistics</span>
                            </button>
                        </div>
                    </div>

                    <!-- High Priority Issues -->
                    <div>
                        <h3 class="text-base font-semibold text-gray-900 mb-3">High Priority Issues</h3>
                        <div class="space-y-3">
                            ${highPriorityIssues.length === 0 ? `
                                <div class="bg-white rounded-2xl shadow-sm p-8 text-center">
                                    <span class="text-green-700 block mb-2 mx-auto w-10 h-10">${helpers.icons.check}</span>
                                    <p class="text-gray-500 text-sm">No high priority issues</p>
                                </div>
                            ` : highPriorityIssues.map(issue => `
                                <div 
                                    onclick="app.navigate('admin-detail', '${issue.id}')"
                                    class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div class="flex gap-4">
                                        <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                                            ${helpers.issueIcon(issue.icon)}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <h4 class="text-gray-900 font-medium mb-1 truncate">${issue.title}</h4>
                                            <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <span class="text-gray-400 w-4 h-4 inline-flex items-center justify-center">${helpers.icons.location}</span>
                                                <span class="truncate">${issue.location}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                ${helpers.getStatusBadge(issue.status)}
                                                ${helpers.getPriorityBadge(issue.priority)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

if (typeof window !== 'undefined') {
    window.adminDashboardScreen = adminDashboardScreen;
}