import { helpers } from "../utils/helpers.js";
import { firestoreService } from "../services/firestore-service.js";
import { storageService } from "../services/storage-service.js";

// Report Issue Screen

export const reportIssueScreen = {
    selectedImage: null,

    render: () => {
        const location = helpers.detectLocation();

        return `
            <div class="min-h-full bg-gray-50 p-6 pb-20 screen-transition">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6">Report New Issue</h2>

                <div class="space-y-6">
                    <div>
                        <label class="block text-gray-700 mb-3 font-medium">Photo</label>
                        <div 
                            id="image-upload-area"
                            onclick="document.getElementById('image-input').click()"
                            class="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                        >
                            <div id="image-preview-container">
                                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <span class="text-gray-400">${helpers.icons.photo}</span>
                                </div>
                                <p class="text-gray-600 mb-1">Tap to upload photo</p>
                                <p class="text-sm text-gray-400">or take a new one</p>
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

                    <div>
                        <label class="block text-gray-700 mb-3 font-medium">Title</label>
                        <input 
                            id="title-input"
                            type="text" 
                            placeholder="Brief description of the issue"
                            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label class="block text-gray-700 mb-3 font-medium">Description</label>
                        <textarea 
                            id="description-input"
                            placeholder="Describe the issue in detail..."
                            rows="4"
                            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label class="block text-gray-700 mb-3 font-medium">Priority</label>
                        <select 
                            id="priority-select"
                            class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-gray-700 mb-3 font-medium">Location</label>
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${helpers.icons.location}</span>
                            <input 
                                id="location-input"
                                type="text" 
                                value="${location}"
                                class="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <p class="text-sm text-gray-500 mt-2 flex items-center gap-1">${helpers.icons.location}<span>Location auto-detected</span></p>
                    </div>

                    <button 
                        id="submit-btn"
                        onclick="reportIssueScreen.handleSubmit()"
                        class="w-full bg-green-600 text-white py-3 rounded-xl shadow-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Submit Report
                    </button>

                    <button 
                        onclick="app.navigate('dashboard')"
                        class="w-full text-gray-600 py-2 font-medium"
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