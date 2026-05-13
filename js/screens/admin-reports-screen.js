import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";

// Admin Reports Screen

export const adminReportsScreen = {
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
            <div class="min-h-full bg-gray-50 pb-32 screen-transition">
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
                            <span class="text-gray-400 block mb-4 mx-auto w-16 h-16">${helpers.icons.reports}</span>
                            <h3 class="text-gray-900 font-semibold mb-2">No Reports</h3>
                            <p class="text-gray-500 text-sm">No ${filter === 'all' ? '' : filter} reports found</p>
                        </div>
                    ` : issues.map(issue => `
                        <div 
                            onclick="app.navigate('admin-detail', '${issue.id}')"
                            class="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div class="flex gap-4">
                                <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center text-3xl flex-shrink-0">
                                    ${issue.imageUrl ? `
                                        <img src="${issue.imageUrl}" alt="Report image" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                                        <div class="w-full h-full hidden items-center justify-center">
                                            ${helpers.issueIcon(issue.icon)}
                                        </div>
                                    ` : `
                                        ${helpers.issueIcon(issue.icon)}
                                    `}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-gray-900 font-medium mb-1 truncate">${issue.title}</h4>
                                    <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span class="text-gray-400 w-4 h-4 inline-flex items-center justify-center">${helpers.icons.location}</span>
                                        <span class="truncate">${issue.location || '(Location not specified)'}</span>
                                    </div>
                                    <div class="flex items-center gap-2 mb-2">
                                        ${helpers.getStatusBadge(issue.status)}
                                        ${helpers.getPriorityBadge(issue.priority)}
                                    </div>
                                    <p class="text-xs text-gray-400">Reported by: ${issue.userEmail}</p>
                                </div>
                                <span class="text-gray-400 flex-shrink-0 self-center">${helpers.icons.arrowRight}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

if (typeof window !== 'undefined') {
    window.adminReportsScreen = adminReportsScreen;
}