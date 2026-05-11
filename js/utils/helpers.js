// Utility Helper Functions

const helpers = {
    icons: {
        home: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M12 3.2 3 10.4V21h6.5v-6.1h5V21H21V10.4L12 3.2Zm0 2.6 7 5.6V19h-3.5v-6.1h-7V19H5V11.4l7-5.6Z"/></svg>`,
        user: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M12 12.2a4.5 4.5 0 1 0-4.5-4.5 4.5 4.5 0 0 0 4.5 4.5Zm0 2.3c-4.2 0-7.8 2.6-7.8 5.8V22h15.6v-1.7c0-3.2-3.6-5.8-7.8-5.8Z"/></svg>`,
        staff: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M10 3h4v2h5v4h-2v12H7V9H5V5h5V3Zm-1 6v10h6V9H9Zm1-4v2h4V5H10Z"/></svg>`,
        settings: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="m19.4 13.5.1-1.5-.1-1.5 2-1.5-2-3.5-2.4.7-1.2-1.1-.3-2.5H9.5l-.3 2.5-1.2 1.1-2.4-.7-2 3.5 2 1.5-.1 1.5.1 1.5-2 1.5 2 3.5 2.4-.7 1.2 1.1.3 2.5h4.8l.3-2.5 1.2-1.1 2.4.7 2-3.5-2-1.5ZM12 16.2A4.2 4.2 0 1 1 12 7.8a4.2 4.2 0 0 1 0 8.4Z"/></svg>`,
        reports: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M5 3h14v18H5V3Zm2 2v14h10V5H7Zm2 2h6v2H9V7Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2Z"/></svg>`,
        stats: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M5 19V5h2v14H5Zm6 0V9h2v10h-2Zm6 0V12h2v7h-2Zm4 2H3v-2h18v2Z"/></svg>`,
        email: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 3.1V17h16V8.1l-8 5.4-8-5.4Zm14.7-1.1H5.3L12 11.5l6.7-4.5Z"/></svg>`,
        lock: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2Zm-8-2a3 3 0 1 1 6 0v2H9V7Zm3 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></svg>`,
        eye: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M12 5c-5.5 0-9.8 4.1-11 7 1.2 2.9 5.5 7 11 7s9.8-4.1 11-7c-1.2-2.9-5.5-7-11-7Zm0 11.2A4.2 4.2 0 1 1 12 8.8a4.2 4.2 0 0 1 0 8.4Zm0-2.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`,
        eyeOff: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M2.3 4.9 3.7 3.5l16.8 16.8-1.4 1.4-2.2-2.2c-1.5.8-3.3 1.2-4.9 1.2-5.5 0-9.8-4.1-11-7 .7-1.7 2.4-4 5-5.7L2.3 4.9Zm7 7a2 2 0 0 0 2.8 2.8l-2.8-2.8Zm2.7-5.6a4.2 4.2 0 0 1 4.2 4.2c0 .5-.1 1-.3 1.5l-1.7-1.7a2 2 0 0 0-2.6-2.6l-1.7-1.7c.6-.2 1.2-.3 1.8-.3Zm6.3 2.1-2.4 2.4c0 3.7-3.1 6.8-6.8 6.8-.5 0-1-.1-1.5-.2L6.5 12c1.2-2 3.7-3.7 6.5-3.7.8 0 1.5.1 2.3.4l2.5-2.5 1.5 1.2Z"/></svg>`,
        google: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="#EA4335" d="M12 10.3v3.9h5.5c-.2 1.4-1.6 4.2-5.5 4.2A6.4 6.4 0 1 1 12 5.6c1.8 0 3 .8 3.7 1.5l2.5-2.4A10 10 0 1 0 12 22c5.7 0 9.5-4 9.5-9.7 0-.7-.1-1.2-.2-1.8H12Z"/><path fill="#4285F4" d="M22 12.3c0-.7-.1-1.2-.2-1.8H12v3.9h5.5c-.2 1.1-1 2.3-2.2 3l3.4 2.6C20.8 18.3 22 15.7 22 12.3Z"/><path fill="#FBBC05" d="M5.3 14.2a6.4 6.4 0 0 1 0-4.4L1.8 7.2a10 10 0 0 0 0 9.6l3.5-2.6Z"/><path fill="#34A853" d="m12 22c2.7 0 5-.9 6.6-2.4l-3.4-2.6c-.9.6-2 .9-3.2.9a6.4 6.4 0 0 1-6.1-4.5l-3.5 2.6A10 10 0 0 0 12 22Z"/></svg>`,
        arrowRight: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-4 w-4"><path fill="currentColor" d="m13.2 5 6 7-6 7-1.5-1.3 3.7-4.4H5v-2h10.4l-3.7-4.3L13.2 5Z"/></svg>`,
        plus: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></svg>`,
        photo: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="M5 5h3l2-2h4l2 2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm7 3.5A4.5 4.5 0 1 0 12 18a4.5 4.5 0 0 0 0-9Z"/></svg>`,
        wrench: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="M22 7.6a7.5 7.5 0 0 1-10.7 6.5L6 19.4l-1.4-1.4 5.3-5.3A7.5 7.5 0 0 1 15.4 2l-2.2 2.2 1.6 1.6 2.2-2.2A7.4 7.4 0 0 1 22 7.6Z"/></svg>`,
        clipboard: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="M9 3h6v2h3a2 2 0 0 1 2 2v14H4V7a2 2 0 0 1 2-2h3V3Zm1 2v2h4V5h-4Zm-4 4v10h12V9H6Z"/></svg>`,
        clock: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 5v5.2l4 2.4-1 1.7-5-3V7h2Z"/></svg>`,
        check: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="m9.2 16.2-4-4 1.4-1.4 2.6 2.6 7.9-7.9 1.4 1.4-9.3 9.3Z"/></svg>`,
        error: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-10 w-10"><path fill="currentColor" d="M12 2 1.8 20h20.4L12 2Zm1 12h-2V9h2v5Zm0 4h-2v-2h2v2Z"/></svg>`,
        note: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M4 4h16v16H4V4Zm2 2v12h12V6H6Zm2 2h8v2H8V8Zm0 4h8v2H8v-2Z"/></svg>`,
        signOut: `<svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5"><path fill="currentColor" d="M10 5H5v14h5v2H3V3h7v2Zm7.3 6-2.6-2.6 1.4-1.4 5 5-5 5-1.4-1.4 2.6-2.6H9v-2h8.3Z"/></svg>`
    },
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
                icon: helpers.icons.clock,
                text: 'Pending'
            },
            'in-progress': {
                color: 'bg-blue-100 text-blue-700',
                icon: helpers.icons.settings,
                text: 'In Progress'
            },
            'resolved': {
                color: 'bg-green-100 text-green-700',
                icon: helpers.icons.check,
                text: 'Resolved'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        return `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${config.color}">
            <span class="inline-flex items-center justify-center w-4 h-4">${config.icon}</span>
            <span>${config.text}</span>
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

    issueIcon: (iconKey) => {
        const key = (iconKey || 'wrench').toString().toLowerCase();
        return helpers.icons[key] || helpers.icons.wrench;
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