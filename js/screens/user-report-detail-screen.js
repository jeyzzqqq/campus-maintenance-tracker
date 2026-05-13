import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";

// User Report Detail Screen - allows users to view their submitted reports with images

export const userReportDetailScreen = {
    isImageZoomOpen: false,

    render: async (issueId) => {
        helpers.showLoading();

        const result = await firestoreService.getIssue(issueId);
        if (!result.success) {
            return `
                <div class="h-full flex items-center justify-center p-6">
                    <div class="text-center">
                        <span class="text-red-500 block mb-4 mx-auto w-16 h-16">${helpers.icons.error}</span>
                        <h3 class="text-gray-900 font-semibold mb-2">Error</h3>
                        <p class="text-gray-500 text-sm">${result.error}</p>
                        <button 
                            onclick="app.navigate('dashboard')"
                            class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
                        >
                            Back to My Reports
                        </button>
                    </div>
                </div>
            `;
        }

        const issue = result.issue;

        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <button 
                        onclick="app.navigate('dashboard')"
                        class="text-white mb-4 flex items-center gap-2 font-medium"
                    >
                        <span class="text-xl">‹</span> Back to My Reports
                    </button>
                    <h2 class="text-xl font-semibold text-white">Report Details</h2>
                </div>

                <div class="p-4 space-y-4 mt-4">
                    <!-- Image & Details -->
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        ${issue.imageUrl ? `
                            <button
                                type="button"
                                onclick="userReportDetailScreen.openImageZoom()"
                                class="block w-full mb-4 overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Zoom report image"
                            >
                                <img src="${issue.imageUrl}" class="w-full h-48 object-cover transition-transform duration-200 hover:scale-105" alt="Report image" onerror="this.style.display='none'" />
                            </button>
                        ` : `
                            <div class="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-6xl mb-4">
                                ${helpers.issueIcon(issue.icon)}
                            </div>
                        `}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${issue.title}</h3>
                        <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <span class="text-gray-400 w-4 h-4 inline-flex items-center justify-center">${helpers.icons.location}</span>
                            <span>${issue.location || '(Location not specified)'}</span>
                        </div>
                        <div class="flex items-center gap-2 mb-3">
                            ${helpers.getStatusBadge(issue.status)}
                            ${helpers.getPriorityBadge(issue.priority)}
                        </div>
                        <p class="text-gray-700 mb-3">${issue.description}</p>
                        <div class="border-t border-gray-100 pt-3">
                            <p class="text-sm text-gray-500">Date: ${helpers.formatDate(issue.createdAt)}</p>
                            ${issue.status === 'resolved' ? `
                                <p class="text-sm text-green-600 font-medium mt-2">✓ This issue has been resolved</p>
                            ` : `
                                <p class="text-sm text-amber-600 font-medium mt-2">⏳ This issue is still being worked on</p>
                            `}
                        </div>
                    </div>

                    ${issue.imageUrl ? `
                        <div 
                            id="user-image-zoom-overlay"
                            class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4"
                            onclick="userReportDetailScreen.closeImageZoom()"
                        >
                            <div class="relative max-w-5xl w-full max-h-full" onclick="event.stopPropagation()">
                                <button
                                    type="button"
                                    onclick="userReportDetailScreen.closeImageZoom()"
                                    class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-gray-900 shadow-lg flex items-center justify-center text-xl"
                                    aria-label="Close image zoom"
                                >
                                    ×
                                </button>
                                <img src="${issue.imageUrl}" alt="Zoomed report image" class="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-black" />
                            </div>
                        </div>
                    ` : ''}

                    <!-- Notes -->
                    ${issue.notes && issue.notes.length > 0 ? `
                        <div class="bg-white rounded-2xl shadow-sm p-4">
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Updates</h3>
                            <div class="space-y-3">
                                ${issue.notes.map((note, idx) => `
                                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <p class="text-gray-700 text-sm">${note.text}</p>
                                        <p class="text-xs text-gray-500 mt-2">
                                            ${note.authorEmail} • ${helpers.formatDate(note.createdAt)}
                                        </p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    ,openImageZoom: () => {
        userReportDetailScreen.isImageZoomOpen = true;
        const overlay = document.getElementById('user-image-zoom-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }
    },

    closeImageZoom: () => {
        userReportDetailScreen.isImageZoomOpen = false;
        const overlay = document.getElementById('user-image-zoom-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }
};

if (typeof window !== 'undefined') {
    window.userReportDetailScreen = userReportDetailScreen;
}
