// Friend Form Handler
class FriendForm {
    constructor(friendManager) {
        this.friendManager = friendManager;
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Form events
        document.getElementById('add-friend-btn').addEventListener('click', () => this.showForm());
        document.getElementById('friend-form-element').addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.getElementById('cancel-btn').addEventListener('click', () => this.hideForm());
        
        // Contact type change event for placeholder updates
        document.getElementById('contact-type').addEventListener('change', (e) => this.updateContactPlaceholder(e.target.value));
    }

    showForm(friendData = null) {
        const form = document.getElementById('friend-form');
        const formTitle = document.getElementById('form-title');
        const nameInput = document.getElementById('friend-name');
        const dateInput = document.getElementById('last-contact');
        const contactTypeSelect = document.getElementById('contact-type');
        const contactInput = document.getElementById('contact-info');

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
        
        form.classList.remove('hidden');
        nameInput.focus();
    }

    hideForm() {
        document.getElementById('friend-form').classList.add('hidden');
        this.currentEditId = null;
    }

    updateContactPlaceholder(contactType) {
        const contactInput = document.getElementById('contact-info');
        const placeholders = {
            phone: 'e.g., +1 (555) 123-4567',
            facebook: 'e.g., https://m.me/username or Facebook messenger username',
            email: 'e.g., friend@example.com',
            discord: 'e.g., username#1234 or Discord user ID'
        };

        contactInput.placeholder = placeholders[contactType] || 'Enter contact details';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('friend-name').value.trim();
        const lastContact = document.getElementById('last-contact').value;
        const contactType = document.getElementById('contact-type').value;
        const contact = document.getElementById('contact-info').value.trim();

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
            this.friendManager.updateFriend(friendData);
        } else {
            // Add new friend
            this.friendManager.addFriend(friendData);
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