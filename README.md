# WaterYourFriends Widget

A reusable JavaScript widget for managing friend contacts and tracking communication frequency. Keep track of when you last contacted your friends and get visual indicators to help maintain your relationships.

## Features

- **Add Friends**: Store friends with their contact information and preferred communication method
- **Contact Types**: Support for phone, email, Facebook Messenger, and Discord
- **Visual Status Indicators**: Icons show how recently you've contacted each friend
- **Update Contact Time**: Quickly update when you last contacted someone
- **Save/Load Data**: Export and import your friend data as JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Installation

### Via NPM
```bash
npm install water-your-friends
```

### Direct Download
Download the `water-your-friends-widget.js` file and include it in your project.

## Usage

### Basic Usage

1. **Include the widget script in your HTML:**
```html
<script src="water-your-friends-widget.js"></script>
```

2. **Create a container element:**
```html
<div id="my-widget-container"></div>
```

3. **Initialize the widget:**
```javascript
// Auto-initialization (looks for default container)
// Just include the script - it will auto-initialize if container exists

// Or create manually
const widget = window.createWaterYourFriendsWidget('my-widget-container');
```

### With Custom Options

```javascript
const widget = window.createWaterYourFriendsWidget('my-container', {
    title: 'My Friend Tracker',
    subtitle: 'Stay connected with friends and family'
});
```

### Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Friend Manager</title>
</head>
<body>
    <div id="water-your-friends-widget"></div>
    <script src="water-your-friends-widget.js"></script>
</body>
</html>
```

## API Reference

### Creating a Widget

```javascript
const widget = window.createWaterYourFriendsWidget(containerId, options)
```

**Parameters:**
- `containerId` (string): ID of the HTML element to contain the widget
- `options` (object, optional): Configuration options
  - `title` (string): Widget title (default: 'Friend Contact Manager')
  - `subtitle` (string): Widget subtitle

### Widget Methods

```javascript
// Add a friend programmatically
widget.addFriend({
    id: Date.now(),
    name: 'John Doe',
    lastContact: '2026-02-01',
    contactType: 'phone',
    contact: '+1234567890'
});

// Update existing friend
widget.updateFriend(friendData);

// Remove a friend
widget.removeFriend(friendId);

// Update contact time to now
widget.updateCallTime(friendId);

// Save data
widget.saveData();

// Access friends data
console.log(widget.friends);
```

## Status Indicators

The widget displays visual status indicators for each friend:

- **🟢 Green (Grown)**: Contacted within the last 7 days
- **🟡 Orange (Growing)**: Contacted within the last 30 days
- **🔴 Red (Sprout)**: Not contacted in over 30 days

## Data Format

Friends are stored in the following format:

```javascript
{
    id: 1645123456789,           // Unique timestamp ID
    name: "John Doe",            // Friend's name
    lastContact: "2026-02-01",   // Last contact date (YYYY-MM-DD)
    contactType: "phone",        // Type: phone, email, facebook, discord
    contact: "+1234567890"       // Contact information
}
```

## Contact Types

- **Phone**: Creates clickable `tel:` links
- **Email**: Creates clickable `mailto:` links  
- **Facebook**: Creates links to Messenger or Facebook profiles
- **Discord**: Displays username and copies to clipboard when clicked

## Browser Support

- Modern browsers with ES6 support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## License

MIT License - see package.json for details

## Contributing

This is a simple vanilla JavaScript widget. Contributions welcome!

## Changelog

### 1.0.0
- Initial widget release
- Self-contained with embedded CSS
- Support for multiple widget instances
- Auto-initialization feature
- Complete API for programmatic usage