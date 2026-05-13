import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";

// Admin Stats Screen

export const adminStatsScreen = {
    render: async () => {
        helpers.showLoading();

        const result = await firestoreService.getStatistics();
        const stats = result.success ? result.stats : {
            total: 0, pending: 0, inProgress: 0, resolved: 0,
            high: 0, medium: 0, low: 0
        };

        const resolvedPercent = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
        const inProgressPercent = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;
        const pendingPercent = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

        return `
            <div class="min-h-full bg-gray-50 pb-32 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <h2 class="text-xl font-semibold text-white mb-1">Statistics</h2>
                    <p class="text-green-100 text-sm">Overview and analytics</p>
                </div>

                <div class="p-4 space-y-4 mt-4">
                    <!-- Overall Stats -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-sm text-gray-600">Total Reports</span>
                                    <span class="text-sm font-semibold text-gray-900">${stats.total}</span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2">
                                    <div class="bg-green-600 h-2 rounded-full" style="width: 100%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-sm text-gray-600">Resolved</span>
                                    <span class="text-sm font-semibold text-green-600">
                                        ${stats.resolved} (${resolvedPercent}%)
                                    </span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2">
                                    <div class="bg-green-600 h-2 rounded-full" style="width: ${resolvedPercent}%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-sm text-gray-600">In Progress</span>
                                    <span class="text-sm font-semibold text-blue-600">
                                        ${stats.inProgress} (${inProgressPercent}%)
                                    </span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${inProgressPercent}%"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-2">
                                    <span class="text-sm text-gray-600">Pending</span>
                                    <span class="text-sm font-semibold text-amber-600">
                                        ${stats.pending} (${pendingPercent}%)
                                    </span>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2">
                                    <div class="bg-amber-600 h-2 rounded-full" style="width: ${pendingPercent}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Priority Breakdown -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">High Priority</span>
                                <span class="text-sm font-semibold text-red-600">
                                    ${stats.high} issues
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Medium Priority</span>
                                <span class="text-sm font-semibold text-amber-600">
                                    ${stats.medium} issues
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Low Priority</span>
                                <span class="text-sm font-semibold text-gray-600">
                                    ${stats.low} issues
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
};

if (typeof window !== 'undefined') {
    window.adminStatsScreen = adminStatsScreen;
}