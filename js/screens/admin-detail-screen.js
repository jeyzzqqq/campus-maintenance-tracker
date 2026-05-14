import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";
import { adminReportsScreen } from "./admin-reports-screen.js";

// Admin Detail Screen

export const adminDetailScreen = {
    currentIssue: null,
    isImageZoomOpen: false,

    deleteIssue: async () => {
        if (!adminDetailScreen.currentIssue) return;

        const confirmed = window.confirm('Delete this report? This cannot be undone.');
        if (!confirmed) return;

        const result = await firestoreService.deleteIssue(adminDetailScreen.currentIssue.id);
        if (result.success) {
            helpers.showSuccess('Report deleted');
            app.navigate('admin-reports', adminReportsScreen.currentFilter || 'all');
        } else {
            helpers.showError(result.error || 'Failed to delete report');
        }
    },

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
                            onclick="app.navigate('admin-reports')"
                            class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
                        >
                            Back to Reports
                        </button>
                    </div>
                </div>
            `;
        }

        adminDetailScreen.currentIssue = result.issue;
        const issue = result.issue;

        return `
            <div class="min-h-full bg-gray-50 pb-20 screen-transition">
                <div class="bg-green-600 text-white p-6 rounded-b-3xl shadow-md">
                    <button 
                        onclick="app.navigate('admin-reports')"
                        class="text-white mb-4 flex items-center gap-2 font-medium"
                    >
                        <span class="text-xl">‹</span> Back to Reports
                    </button>
                    <h2 class="text-xl font-semibold text-white">Report Details</h2>
                </div>

                <div class="p-4 space-y-4 mt-4">
                    <!-- Image & Details -->
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        ${issue.imageUrl ? `
                            <button
                                type="button"
                                onclick="adminDetailScreen.openImageZoom()"
                                class="block w-full mb-4 overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                aria-label="Zoom report image"
                            >
                                <img src="${issue.imageUrl}" class="w-full h-48 object-cover transition-transform duration-200 hover:scale-105" alt="Report image" />
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
                        <button
                            type="button"
                            onclick="adminDetailScreen.deleteIssue()"
                            class="w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors mb-3"
                        >
                            Delete Report
                        </button>
                        <div class="border-t border-gray-100 pt-3">
                            <p class="text-sm text-gray-500">Reported by: ${issue.userEmail}</p>
                            <p class="text-sm text-gray-500">Date: ${helpers.formatDate(issue.createdAt)}</p>
                            ${issue.assignedTo ? `
                                <p class="text-sm text-gray-500">Assigned to: ${issue.assignedTo}</p>
                            ` : ''}
                        </div>
                    </div>

                    ${issue.imageUrl ? `
                        <div 
                            id="image-zoom-overlay"
                            class="fixed inset-0 z-50 hidden items-center justify-center bg-black/80 p-4"
                            onclick="adminDetailScreen.closeImageZoom()"
                        >
                            <div class="relative max-w-5xl w-full max-h-full" onclick="event.stopPropagation()">
                                <button
                                    type="button"
                                    onclick="adminDetailScreen.closeImageZoom()"
                                    class="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-gray-900 shadow-lg flex items-center justify-center text-xl"
                                    aria-label="Close image zoom"
                                >
                                    ×
                                </button>
                                <img src="${issue.imageUrl}" alt="Zoomed report image" class="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl bg-black" />
                            </div>
                        </div>
                    ` : ''}

                    <!-- Update Status -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Update Status</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <button 
                                onclick="adminDetailScreen.updateStatus('pending')"
                                class="bg-amber-50 text-amber-700 py-2 px-3 rounded-lg text-sm hover:bg-amber-100 transition-colors font-medium"
                            >
                                Pending
                            </button>
                            <button 
                                onclick="adminDetailScreen.updateStatus('in-progress')"
                                class="bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm hover:bg-blue-100 transition-colors font-medium"
                            >
                                In Progress
                            </button>
                            <button 
                                onclick="adminDetailScreen.updateStatus('resolved')"
                                class="bg-green-50 text-green-700 py-2 px-3 rounded-lg text-sm hover:bg-green-100 transition-colors font-medium"
                            >
                                Resolved
                            </button>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                        <div id="notes-container" class="mb-4">
                            ${issue.notes && issue.notes.length > 0 ? issue.notes.map(note => `
                                <div class="bg-gray-50 p-3 rounded-lg mb-2">
                                    <p class="text-sm text-gray-700">${note.text || note}</p>
                                    ${note.authorEmail ? `
                                        <p class="text-xs text-gray-400 mt-1">- ${note.authorEmail}</p>
                                    ` : ''}
                                </div>
                            `).join('') : `
                                <p class="text-sm text-gray-500">No notes yet</p>
                            `}
                        </div>
                        <div class="flex gap-2">
                            <input 
                                id="note-input"
                                type="text" 
                                placeholder="Add a note..."
                                class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            />
                            <button 
                                onclick="adminDetailScreen.addNote()"
                                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <span class="w-5 h-5 inline-flex items-center justify-center">${helpers.icons.note}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Assign to Staff -->
                    <div class="bg-white rounded-2xl shadow-sm p-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">Assign to Staff</h3>
                        <select 
                            id="assign-select"
                            onchange="adminDetailScreen.assignStaff()"
                            class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                            <option value="">Select staff member...</option>
                            <option value="Mike Johnson">Mike Johnson</option>
                            <option value="Tom Wilson">Tom Wilson</option>
                            <option value="Sarah Martinez">Sarah Martinez</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    },

    openImageZoom: () => {
        adminDetailScreen.isImageZoomOpen = true;
        const overlay = document.getElementById('image-zoom-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }
    },

    closeImageZoom: () => {
        adminDetailScreen.isImageZoomOpen = false;
        const overlay = document.getElementById('image-zoom-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    },

    updateStatus: async (newStatus) => {
        if (!adminDetailScreen.currentIssue) return;

        const result = await firestoreService.updateIssue(adminDetailScreen.currentIssue.id, { status: newStatus });
        
        if (result.success) {
            helpers.showSuccess(`Status updated to ${newStatus}`);
            app.navigate('admin-detail', adminDetailScreen.currentIssue.id);
        } else {
            helpers.showError('Failed to update status');
        }
    },

    addNote: async () => {
        if (!adminDetailScreen.currentIssue) return;

        const noteInput = document.getElementById('note-input');
        const noteText = noteInput.value.trim();

        if (!noteText) {
            helpers.showError('Please enter a note');
            return;
        }

        const result = await firestoreService.addNote(adminDetailScreen.currentIssue.id, noteText);
        
        if (result.success) {
            noteInput.value = '';
            app.navigate('admin-detail', adminDetailScreen.currentIssue.id);
        } else {
            helpers.showError('Failed to add note');
        }
    },

    assignStaff: async () => {
        if (!adminDetailScreen.currentIssue) return;

        const select = document.getElementById('assign-select');
        const staffName = select.value;

        if (!staffName) return;

        const result = await firestoreService.updateIssue(adminDetailScreen.currentIssue.id, { 
            assignedTo: staffName 
        });
        
        if (result.success) {
            helpers.showSuccess(`Assigned to ${staffName}`);
            app.navigate('admin-detail', adminDetailScreen.currentIssue.id);
        } else {
            helpers.showError('Failed to assign staff');
        }
    }
};

if (typeof window !== 'undefined') {
    window.adminDetailScreen = adminDetailScreen;
}