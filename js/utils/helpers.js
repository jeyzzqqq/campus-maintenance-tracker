// Utility Helper Functions

const helpers = {
    // Format date to readable string
    formatDate: (date) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toISOString().split('T')[0];
    },

    // Get status badge HTML
    getStatusBadge: (status) => {
        const statusConfig = {
            'pending': {
                color: 'bg-amber-100 text-amber-700',
                icon: '⏱️',
                text: 'Pending'
            },
            'in-progress': {
                color: 'bg-blue-100 text-blue-700',
                icon: '⚙️',
                text: 'In Progress'
            },
            'resolved': {
                color: 'bg-green-100 text-green-700',
                icon: '✓',
                text: 'Resolved'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        return `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${config.color}">
            ${config.icon} ${config.text}
        </span>`;
    },

    // Get priority badge HTML
    getPriorityBadge: (priority) => {
        const priorityConfig = {
            'low': 'bg-gray-100 text-gray-700',
            'medium': 'bg-amber-100 text-amber-700',
            'high': 'bg-red-100 text-red-700'
        };

        const color = priorityConfig[priority] || priorityConfig['low'];
        return `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs ${color}">
            ${priority}
        </span>`;
    },

    // Show loading spinner
    showLoading: () => {
        const container = document.getElementById('screen-container');
        container.innerHTML = `
            <div class="h-full flex items-center justify-center">
                <div class="spinner"></div>
            </div>
        `;
    },

    // Show error message
    showError: (message) => {
        alert(message);
    },

    // Show success message
    showSuccess: (message) => {
        alert(message);
    },

    // Validate email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Get current user role
    getCurrentUserRole: async () => {
        const user = auth.currentUser;
        if (!user) return null;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            return userDoc.exists ? userDoc.data().role : 'user';
        } catch (error) {
            console.error('Error getting user role:', error);
            return 'user';
        }
    },

    // Auto-detect location (mock for demo)
    detectLocation: () => {
        const locations = [
            'Engineering Building, Floor 2',
            'Science Hall, Room 301',
            'Library, 3rd Floor',
            'Student Center',
            'Dorm Building A',
            'Computer Lab, Building C'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }
};

window.helpers = helpers;