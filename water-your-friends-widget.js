/**
 * WaterYourFriends Widget
 * A self-contained friend contact management widget
 */
class WaterYourFriends {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.options = {
            title: options.title || 'Friend Contact Manager',
            subtitle: options.subtitle || 'Keep track of your friends and when you last contacted them',
            ...options
        };
        
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }
        
        this.friends = [];
        this.friendForm = null;
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
        this.renderFriends();
        // Initialize form handler after DOM is ready
        this.friendForm = new FriendFormWidget(this);
    }
    
    render() {
        this.container.innerHTML = `
            <div class="wyf-widget">
                <header class="wyf-header">
                    <h1>${this.options.title}</h1>
                    <p>${this.options.subtitle}</p>
                </header>

                <main class="wyf-main">
                    <!-- Control Panel -->
                    <div class="wyf-control-panel">
                        <button class="wyf-add-friend-btn wyf-btn wyf-btn-primary">Add Friend</button>
                        <button class="wyf-save-btn wyf-btn wyf-btn-success">Save Data</button>
                        <button class="wyf-load-btn wyf-btn wyf-btn-info">Load Data</button>
                        <button class="wyf-ack-btn wyf-btn wyf-btn-secondary">Acknowledgements</button>
                        <input type="file" class="wyf-file-input" accept=".json" style="display: none;">
                    </div>

                    <!-- Add/Edit Friend Form -->
                    <div class="wyf-friend-form wyf-form-container wyf-hidden">
                        <h3 class="wyf-form-title">Add New Friend</h3>
                        <form class="wyf-friend-form-element">
                            <div class="wyf-form-group">
                                <label for="wyf-friend-name">Friend Name:</label>
                                <input type="text" class="wyf-friend-name" required>
                            </div>
                            <div class="wyf-form-group">
                                <label for="wyf-last-contact">Last Contact Date:</label>
                                <input type="date" class="wyf-last-contact" required>
                            </div>
                            <div class="wyf-form-group">
                                <label for="wyf-contact-type">Contact Type:</label>
                                <select class="wyf-contact-type" required>
                                    <option value="">Select contact type</option>
                                    <option value="phone">Phone</option>
                                    <option value="facebook">Facebook Messenger</option>
                                    <option value="email">Email</option>
                                    <option value="discord">Discord</option>
                                </select>
                            </div>
                            <div class="wyf-form-group">
                                <label for="wyf-contact-info">Contact Info:</label>
                                <input type="text" class="wyf-contact-info" placeholder="Enter contact details" required>
                            </div>
                            <div class="wyf-form-actions">
                                <button type="submit" class="wyf-btn wyf-btn-primary">Save Friend</button>
                                <button type="button" class="wyf-cancel-btn wyf-btn wyf-btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>

                    <!-- Friends List -->
                    <div class="wyf-friends-list">
                        <h3>Your Friends</h3>
                        <div class="wyf-friends-container">
                            <p class="wyf-empty-state">No friends added yet. Click "Add Friend" to get started!</p>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        // Add widget-specific styles
        this.addStyles();
    }
    
    addStyles() {
        if (document.getElementById('wyf-widget-styles')) return; // Styles already added
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'wyf-widget-styles';
        styleSheet.textContent = this.getWidgetCSS();
        document.head.appendChild(styleSheet);
    }
    
    getWidgetCSS() {
        return `
        .wyf-widget {
            max-width: 1000px;
            margin: 20px auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
            border-radius: 8px;
        }
        
        .wyf-header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .wyf-header h1 {
            color: #2c3e50;
            margin: 0 0 10px 0;
        }
        
        .wyf-header p {
            color: #7f8c8d;
            font-size: 1.1em;
            margin: 0;
        }
        
        .wyf-control-panel {
            margin-bottom: 30px;
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .wyf-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin: 0 5px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .wyf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .wyf-btn-primary { background-color: #3498db; color: white; }
        .wyf-btn-primary:hover { background-color: #2980b9; }
        .wyf-btn-success { background-color: #27ae60; color: white; }
        .wyf-btn-success:hover { background-color: #229954; }
        .wyf-btn-info { background-color: #17a2b8; color: white; }
        .wyf-btn-info:hover { background-color: #138496; }
        .wyf-btn-secondary { background-color: #95a5a6; color: white; }
        .wyf-btn-secondary:hover { background-color: #7f8c8d; }
        .wyf-btn-danger { background-color: #e74c3c; color: white; }
        .wyf-btn-danger:hover { background-color: #c0392b; }
        .wyf-btn-warning { background-color: #f39c12; color: white; }
        .wyf-btn-warning:hover { background-color: #d68910; }
        
        .wyf-btn-small {
            padding: 8px 16px;
            font-size: 12px;
            margin: 0 2px;
        }
        
        .wyf-form-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .wyf-form-container h3 {
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .wyf-form-group {
            margin-bottom: 20px;
        }
        
        .wyf-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #34495e;
        }
        
        .wyf-form-group input,
        .wyf-form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ecf0f1;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
            background-color: white;
            box-sizing: border-box;
        }
        
        .wyf-form-group input:focus,
        .wyf-form-group select:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .wyf-form-group select {
            cursor: pointer;
        }
        
        .wyf-form-actions {
            margin-top: 25px;
        }
        
        .wyf-friends-list {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .wyf-friends-list h3 {
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .wyf-empty-state {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            padding: 40px;
        }
        
        .wyf-friend-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
        }
        
        .wyf-friend-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .wyf-friend-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            gap: 15px;
        }
        
        .wyf-contact-status-img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            flex-shrink: 0;
            object-fit: cover;
            border: 2px solid #e9ecef;
        }
        
        .wyf-friend-name {
            font-size: 1.2em;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .wyf-friend-actions {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        
        .wyf-friend-info {
            margin-bottom: 15px;
        }
        
        .wyf-friend-info p {
            margin-bottom: 5px;
            color: #5a6c7d;
        }
        
        .wyf-friend-info strong {
            color: #2c3e50;
        }
        
        .wyf-contact-btn {
            word-break: break-all;
            max-width: 250px;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .wyf-contact-btn:hover {
            transform: translateY(-1px);
        }
        
        .wyf-hidden {
            display: none;
        }
        
        @media (max-width: 768px) {
            .wyf-widget {
                margin: 10px;
                padding: 10px;
            }
            
            .wyf-friend-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }
            
            .wyf-friend-actions {
                width: 100%;
                justify-content: flex-start;
            }
            
            .wyf-control-panel .wyf-btn {
                margin: 5px;
                display: inline-block;
            }
        }
        `;
    }
    
    bindEvents() {
        const widget = this.container.querySelector('.wyf-widget');
        
        // Save and load events
        widget.querySelector('.wyf-save-btn').addEventListener('click', () => this.saveData());
        widget.querySelector('.wyf-load-btn').addEventListener('click', () => this.loadData());
        widget.querySelector('.wyf-file-input').addEventListener('change', (e) => this.handleFileLoad(e));
        widget.querySelector('.wyf-ack-btn').addEventListener('click', () => this.showAcknowledgements());
    }
    
    showAcknowledgements() {
        window.open('ack.html', '_blank');
    }
    
    addFriend(friendData) {
        this.friends.push(friendData);
        this.renderFriends();
    }

    updateFriend(friendData) {
        const index = this.friends.findIndex(f => f.id === friendData.id);
        if (index !== -1) {
            this.friends[index] = friendData;
            this.renderFriends();
        }
    }

    updateCallTime(id) {
        const friend = this.friends.find(f => f.id === id);
        if (friend) {
            const today = new Date();
            friend.lastContact = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            this.renderFriends();
        }
    }

    editFriend(id) {
        const friend = this.friends.find(f => f.id === id);
        if (friend && this.friendForm) {
            this.friendForm.editFriend(friend);
        }
    }

    removeFriend(id) {
        if (confirm('Are you sure you want to remove this friend?')) {
            this.friends = this.friends.filter(f => f.id !== id);
            this.renderFriends();
        }
    }

    renderFriends() {
        const container = this.container.querySelector('.wyf-friends-container');
        
        if (this.friends.length === 0) {
            container.innerHTML = '<p class="wyf-empty-state">No friends added yet. Click "Add Friend" to get started!</p>';
            return;
        }

        // Sort friends by last contact date in descending order (most recent first)
        const sortedFriends = [...this.friends].sort((a, b) => {
            const dateA = new Date(a.lastContact);
            const dateB = new Date(b.lastContact);
            return dateB.getTime() - dateA.getTime();
        });
        
        const friendsHTML = sortedFriends.map(friend => this.createFriendCard(friend)).join('');
        container.innerHTML = friendsHTML;
    }

    createFriendCard(friend) {
        const lastContactDate = new Date(friend.lastContact);
        const formattedDate = lastContactDate.toLocaleDateString();
        const daysSince = this.getDaysSinceContact(lastContactDate);
        
        // Handle different contact types
        const contactDisplay = this.formatContactLink(friend.contact, friend.contactType || 'phone');
        const contactTypeLabel = this.getContactTypeLabel(friend.contactType || 'phone');
        
        // Get the appropriate image based on last contact
        const statusImage = this.getContactStatusImage(daysSince);
        const widgetId = this.containerId;

        return `
            <div class="wyf-friend-card">
                <div class="wyf-friend-header">
                    <img src="assets/${statusImage}" alt="Contact Status" class="wyf-contact-status-img">
                    <div class="wyf-friend-name">${this.escapeHtml(friend.name)}</div>
                    <div class="wyf-friend-actions">
                        <button class="wyf-btn wyf-btn-small wyf-btn-warning" onclick="window.wyfWidgets['${widgetId}'].updateCallTime(${friend.id})">
                            Update Call Time
                        </button>
                        <button class="wyf-btn wyf-btn-small wyf-btn-info" onclick="window.wyfWidgets['${widgetId}'].editFriend(${friend.id})">
                            Edit
                        </button>
                        <button class="wyf-btn wyf-btn-small wyf-btn-danger" onclick="window.wyfWidgets['${widgetId}'].removeFriend(${friend.id})">
                            Remove
                        </button>
                    </div>
                </div>
                <div class="wyf-friend-info">
                    <p><strong>Last Contact:</strong> ${formattedDate} (${daysSince} days ago)</p>
                    <p><strong>Contact Type:</strong> ${contactTypeLabel}</p>
                    <p><strong>Contact:</strong> ${contactDisplay}</p>
                </div>
            </div>
        `;
    }

    formatContactLink(contact, contactType) {
        switch (contactType) {
            case 'phone':
                return `<button class="wyf-btn wyf-btn-small wyf-btn-info wyf-contact-btn" onclick="window.open('tel:${contact}', '_self')">${this.escapeHtml(contact)}</button>`;
            case 'email':
                return `<button class="wyf-btn wyf-btn-small wyf-btn-info wyf-contact-btn" onclick="window.open('mailto:${contact}', '_self')">${this.escapeHtml(contact)}</button>`;
            case 'facebook':
                if (contact.startsWith('http')) {
                    return `<button class="wyf-btn wyf-btn-small wyf-btn-info wyf-contact-btn" onclick="window.open('${contact}', '_blank')">${this.escapeHtml(contact)}</button>`;
                } else {
                    return `<button class="wyf-btn wyf-btn-small wyf-btn-info wyf-contact-btn" onclick="window.open('https://m.me/${contact}', '_blank')">${this.escapeHtml(contact)}</button>`;
                }
            case 'discord':
                return `<button class="wyf-btn wyf-btn-small wyf-btn-secondary wyf-contact-btn" onclick="navigator.clipboard.writeText('${contact}').then(() => alert('Discord username copied to clipboard!'))">${this.escapeHtml(contact)}</button>`;
            default:
                return `<button class="wyf-btn wyf-btn-small wyf-btn-secondary wyf-contact-btn">${this.escapeHtml(contact)}</button>`;
        }
    }

    getContactTypeLabel(contactType) {
        const labels = {
            phone: 'Phone',
            facebook: 'Facebook Messenger',
            email: 'Email',
            discord: 'Discord'
        };
        return labels[contactType] || 'Unknown';
    }

    getContactStatusImage(daysSince) {
        if (daysSince <= 7) {
            return 'grown.svg';     // Contacted within last week
        } else if (daysSince <= 30) {
            return 'growing.svg';   // Contacted within last month
        } else {
            return 'sprout.svg';    // Not contacted in over a month
        }
    }

    getDaysSinceContact(contactDate) {
        const today = new Date();
        const timeDiff = today.getTime() - contactDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveData() {
        if (this.friends.length === 0) {
            alert('No friends data to save!');
            return;
        }

        const dataToSave = {
            friends: this.friends,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const jsonString = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `friends-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Friends data saved successfully!');
    }

    loadData() {
        this.container.querySelector('.wyf-file-input').click();
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            alert('Please select a valid JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate data structure
                if (data.friends && Array.isArray(data.friends)) {
                    // Add backward compatibility - set default contactType for old data
                    data.friends.forEach(friend => {
                        if (!friend.contactType) {
                            // Try to guess contact type from the contact string
                            if (friend.contact && friend.contact.includes('@')) {
                                friend.contactType = 'email';
                            } else if (friend.contact && (friend.contact.includes('http') || friend.contact.includes('facebook.com') || friend.contact.includes('m.me'))) {
                                friend.contactType = 'facebook';
                            } else {
                                friend.contactType = 'phone'; // Default fallback
                            }
                        }
                    });
                    
                    // Check if we should replace or merge data
                    if (this.friends.length > 0) {
                        const shouldReplace = confirm(
                            'You already have friends data. Do you want to replace it with the loaded data? ' +
                            'Click Cancel to merge the data instead.'
                        );
                        
                        if (shouldReplace) {
                            this.friends = data.friends;
                        } else {
                            // Merge data, avoiding duplicates based on name
                            const existingNames = new Set(this.friends.map(f => f.name.toLowerCase()));
                            const newFriends = data.friends.filter(f => 
                                !existingNames.has(f.name.toLowerCase())
                            );
                            
                            // Update IDs to avoid conflicts
                            const maxId = this.friends.length > 0 ? Math.max(...this.friends.map(f => f.id)) : 0;
                            newFriends.forEach((friend, index) => {
                                friend.id = maxId + index + 1;
                            });
                            
                            this.friends.push(...newFriends);
                            
                            if (newFriends.length === 0) {
                                alert('No new friends were added (all friends from the file already exist)');
                            } else {
                                alert(`${newFriends.length} new friends were added to your list`);
                            }
                        }
                    } else {
                        this.friends = data.friends;
                    }
                    
                    this.renderFriends();
                    alert('Friends data loaded successfully!');
                } else {
                    alert('Invalid file format. Please select a valid friends data file.');
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }
}

// Friend Form Widget Handler
class FriendFormWidget {
    constructor(wyfWidget) {
        this.wyfWidget = wyfWidget;
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const widget = this.wyfWidget.container.querySelector('.wyf-widget');
        
        // Form events
        widget.querySelector('.wyf-add-friend-btn').addEventListener('click', () => this.showForm());
        widget.querySelector('.wyf-friend-form-element').addEventListener('submit', (e) => this.handleFormSubmit(e));
        widget.querySelector('.wyf-cancel-btn').addEventListener('click', () => this.hideForm());
        
        // Contact type change event for placeholder updates
        widget.querySelector('.wyf-contact-type').addEventListener('change', (e) => this.updateContactPlaceholder(e.target.value));
    }

    showForm(friendData = null) {
        const widget = this.wyfWidget.container.querySelector('.wyf-widget');
        const form = widget.querySelector('.wyf-friend-form');
        const formTitle = widget.querySelector('.wyf-form-title');
        const nameInput = widget.querySelector('.wyf-friend-name');
        const dateInput = widget.querySelector('.wyf-last-contact');
        const contactTypeSelect = widget.querySelector('.wyf-contact-type');
        const contactInput = widget.querySelector('.wyf-contact-info');

        if (friendData) {
            // Editing existing friend
            formTitle.textContent = 'Edit Friend';
            nameInput.value = friendData.name;
            dateInput.value = friendData.lastContact;
            contactTypeSelect.value = friendData.contactType || '';
            contactInput.value = friendData.contact;
            this.currentEditId = friendData.id;
        } else {
            // Adding new friend
            formTitle.textContent = 'Add New Friend';
            nameInput.value = '';
            dateInput.value = '';
            contactTypeSelect.value = '';
            contactInput.value = '';
            this.currentEditId = null;
        }

        // Update placeholder based on selected contact type
        this.updateContactPlaceholder(contactTypeSelect.value);
        
        form.classList.remove('wyf-hidden');
        nameInput.focus();
    }

    hideForm() {
        const widget = this.wyfWidget.container.querySelector('.wyf-widget');
        widget.querySelector('.wyf-friend-form').classList.add('wyf-hidden');
        this.currentEditId = null;
    }

    updateContactPlaceholder(contactType) {
        const widget = this.wyfWidget.container.querySelector('.wyf-widget');
        const contactInput = widget.querySelector('.wyf-contact-info');
        const placeholders = {
            phone: 'e.g., +1 (555) 123-4567',
            facebook: 'e.g., https://m.me/username or Facebook username',
            email: 'e.g., friend@example.com',
            discord: 'e.g., username#1234 or Discord user ID'
        };

        contactInput.placeholder = placeholders[contactType] || 'Enter contact details';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const widget = this.wyfWidget.container.querySelector('.wyf-widget');
        const name = widget.querySelector('.wyf-friend-name').value.trim();
        const lastContact = widget.querySelector('.wyf-last-contact').value;
        const contactType = widget.querySelector('.wyf-contact-type').value;
        const contact = widget.querySelector('.wyf-contact-info').value.trim();

        if (!name || !lastContact || !contactType || !contact) {
            alert('Please fill in all fields');
            return;
        }

        // Validate contact format based on type
        if (!this.validateContact(contactType, contact)) {
            return;
        }

        const friendData = {
            id: this.currentEditId || Date.now(),
            name: name,
            lastContact: lastContact,
            contactType: contactType,
            contact: contact
        };

        if (this.currentEditId) {
            // Update existing friend
            this.wyfWidget.updateFriend(friendData);
        } else {
            // Add new friend
            this.wyfWidget.addFriend(friendData);
        }

        this.hideForm();
    }

    validateContact(contactType, contact) {
        switch (contactType) {
            case 'phone':
                // Basic phone number validation
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                const cleanPhone = contact.replace(/[\s\-\(\)]/g, '');
                if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 7) {
                    alert('Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'email':
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(contact)) {
                    alert('Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'facebook':
                // Accept URLs or usernames
                if (!contact.includes('facebook.com') && !contact.includes('m.me') && contact.length < 3) {
                    alert('Please enter a valid Facebook URL or username');
                    return false;
                }
                break;
                
            case 'discord':
                // Accept Discord usernames or user IDs
                if (contact.length < 3) {
                    alert('Please enter a valid Discord username or ID');
                    return false;
                }
                break;
        }
        return true;
    }

    editFriend(friendData) {
        this.showForm(friendData);
    }
}

// Global widget registry
if (!window.wyfWidgets) {
    window.wyfWidgets = {};
}

// Auto-initialize widget if container exists
document.addEventListener('DOMContentLoaded', function() {
    // Register widget creation function globally
    window.createWaterYourFriendsWidget = function(containerId, options = {}) {
        const widget = new WaterYourFriends(containerId, options);
        window.wyfWidgets[containerId] = widget;
        return widget;
    };
    
    // Auto-initialize if default container exists
    if (document.getElementById('water-your-friends-widget')) {
        window.createWaterYourFriendsWidget('water-your-friends-widget');
    }
});