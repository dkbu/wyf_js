// Friend Contact Manager Application
class FriendManager {
    constructor() {
        this.friends = [];
        this.friendForm = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderFriends();
        // Initialize form handler after DOM is ready
        this.friendForm = new FriendForm(this);
    }

    bindEvents() {
        // Save and load events
        document.getElementById('save-btn').addEventListener('click', () => this.saveData());
        document.getElementById('load-btn').addEventListener('click', () => this.loadData());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileLoad(e));
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
        const container = document.getElementById('friends-container');
        
        if (this.friends.length === 0) {
            container.innerHTML = '<p class="empty-state">No friends added yet. Click "Add Friend" to get started!</p>';
            return;
        }

        const friendsHTML = this.friends.map(friend => this.createFriendCard(friend)).join('');
        container.innerHTML = friendsHTML;
    }

    createFriendCard(friend) {
        const lastContactDate = new Date(friend.lastContact);
        const formattedDate = lastContactDate.toLocaleDateString();
        const daysSince = this.getDaysSinceContact(lastContactDate);
        
        // Handle different contact types
        const contactDisplay = this.formatContactLink(friend.contact, friend.contactType || 'phone');
        const contactTypeLabel = this.getContactTypeLabel(friend.contactType || 'phone');

        return `
            <div class="friend-card">
                <div class="friend-header">
                    <div class="friend-name">${this.escapeHtml(friend.name)}</div>
                    <div class="friend-actions">
                        <button class="btn btn-small btn-warning" onclick="friendManager.updateCallTime(${friend.id})">
                            Update Call Time
                        </button>
                        <button class="btn btn-small btn-info" onclick="friendManager.editFriend(${friend.id})">
                            Edit
                        </button>
                        <button class="btn btn-small btn-danger" onclick="friendManager.removeFriend(${friend.id})">
                            Remove
                        </button>
                    </div>
                </div>
                <div class="friend-info">
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
                return `<button class="btn btn-small btn-info contact-btn" onclick="window.open('tel:${contact}', '_self')">${this.escapeHtml(contact)}</button>`;
            case 'email':
                return `<button class="btn btn-small btn-info contact-btn" onclick="window.open('mailto:${contact}', '_self')">${this.escapeHtml(contact)}</button>`;
            case 'facebook':
                if (contact.startsWith('http')) {
                    return `<button class="btn btn-small btn-info contact-btn" onclick="window.open('${contact}', '_blank')">${this.escapeHtml(contact)}</button>`;
                } else {
                    return `<button class="btn btn-small btn-info contact-btn" onclick="window.open('https://m.me/${contact}', '_blank')">${this.escapeHtml(contact)}</button>`;
                }
            case 'discord':
                return `<button class="btn btn-small btn-secondary contact-btn" onclick="window.open('${this.escapeHtml(contact)}', '_blank')">Discord</button>`;
            default:
                return `<button class="btn btn-small btn-secondary contact-btn">${this.escapeHtml(contact)}</button>`;
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
        document.getElementById('file-input').click();
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

// Initialize the application when the page loads
let friendManager;

document.addEventListener('DOMContentLoaded', function() {
    friendManager = new FriendManager();
});