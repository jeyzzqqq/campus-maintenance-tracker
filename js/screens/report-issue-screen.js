import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";
import { storageService } from "../services/storage-service.js";

// Report Issue Screen

export const reportIssueScreen = {
    selectedImage: null,

    render: () => {
        const location = helpers.detectLocation();

        return `
            <div class="min-h-full bg-gray-50 pb-32 screen-transition">
                <!-- Header -->
                <div class="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                    <div class="px-6 py-6">
                        <h1 class="text-2xl font-bold text-gray-900">Report New Issue</h1>
                    </div>
                </div>

                <!-- Form Content -->
                <div class="px-6 py-6 space-y-6">
                    <!-- Photo Upload Section -->
                    <div>
                        <label class="block text-base font-medium text-gray-900 mb-3">Photo</label>
                        <div 
                            id="image-upload-area"
                            onclick="document.getElementById('image-input').click()"
                            class="border-2 border-dashed border-gray-300 bg-white rounded-2xl px-6 py-8 text-center hover:border-green-600 transition-colors cursor-pointer"
                        >
                            <div id="image-preview-container">
                                <div class="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <p class="text-gray-700 font-medium mb-1">Tap to upload photo</p>
                                <p class="text-sm text-gray-500">or take a new one</p>
                            </div>
                        </div>
                        <input 
                            id="image-input" 
                            type="file" 
                            accept="image/*" 
                            class="hidden"
                            onchange="reportIssueScreen.handleImageSelect(event)"
                        />
                    </div>

                    <!-- Title Input -->
                    <div>
                        <label class="block text-base font-medium text-gray-900 mb-3">Title</label>
                        <input 
                            id="title-input"
                            type="text" 
                            placeholder="Brief description of the issue"
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                        />
                    </div>

                    <!-- Description Textarea -->
                    <div>
                        <label class="block text-base font-medium text-gray-900 mb-3">Description</label>
                        <textarea 
                            id="description-input"
                            placeholder="Describe the issue in detail..."
                            rows="4"
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                        ></textarea>
                    </div>

                    <!-- Priority Dropdown -->
                    <div>
                        <label class="block text-base font-medium text-gray-900 mb-3">Priority</label>
                        <select 
                            id="priority-select"
                            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all appearance-none cursor-pointer"
                            style="background-image: url('data:image/svg+xml;utf8,<svg fill=\"%23666\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>'); background-repeat: no-repeat; background-position: right 8px center; background-size: 24px; padding-right: 36px;"
                        >
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <!-- Location Input -->
                    <div>
                        <label class="block text-base font-medium text-gray-900 mb-3">Location</label>
                        <div class="relative">
                            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                            <input 
                                id="location-input"
                                type="text" 
                                value="${location}"
                                class="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                            />
                        </div>
                        <p class="text-sm text-gray-600 mt-2 flex items-center gap-2">
                            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                            </svg>
                            <span>Location auto-detected</span>
                        </p>
                    </div>

                    <!-- Submit Button -->
                    <button 
                        id="submit-btn"
                        onclick="reportIssueScreen.handleSubmit()"
                        class="w-full bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 active:scale-98 transition-all font-medium text-base"
                    >
                        Submit Report
                    </button>

                    <!-- Cancel Button -->
                    <button 
                        onclick="app.navigate('dashboard')"
                        class="w-full text-gray-700 py-2 font-medium text-base hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        `;
    },

    handleImageSelect: (event) => {
        const file = event.target.files[0];
        if (!file) return;

        reportIssueScreen.selectedImage = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('image-preview-container');
            previewContainer.innerHTML = `
                <img src="${e.target.result}" class="image-preview mx-auto mb-3" />
                <p class="text-green-600 text-sm flex items-center justify-center gap-1"><span class="w-4 h-4">${helpers.icons.check}</span><span>Image selected</span></p>
            `;
        };
        reader.readAsDataURL(file);
    },

    handleSubmit: async () => {
        const title = document.getElementById('title-input').value;
        const description = document.getElementById('description-input').value;
        const priority = document.getElementById('priority-select').value;
        const location = document.getElementById('location-input').value;
        const submitBtn = document.getElementById('submit-btn');

        if (!title || !description || !location) {
            helpers.showError('Please fill in all required fields');
            return;
        }

        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        let imageUrl = null;

        // Upload image if selected
        if (reportIssueScreen.selectedImage) {
            const uploadResult = await storageService.uploadImage(reportIssueScreen.selectedImage);
            if (uploadResult.success) {
                imageUrl = uploadResult.url;
            }
        }

        // Create issue
        const issueData = {
            title,
            description,
            priority,
            location,
            imageUrl,
            icon: 'wrench',
            notes: []
        };

        const result = await firestoreService.createIssue(issueData);

        if (result.success) {
            helpers.showSuccess('Report submitted successfully!');
            reportIssueScreen.selectedImage = null;
            app.navigate('dashboard');
        } else {
            helpers.showError(result.error || 'Failed to submit report');
            submitBtn.textContent = 'Submit Report';
            submitBtn.disabled = false;
        }
    }
};

if (typeof window !== 'undefined') {
    window.reportIssueScreen = reportIssueScreen;
}