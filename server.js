const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express(); // Ensure app is defined here
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true
    })
);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Sample auction items
const auctionItems = [
    { id: '1', name: 'Item 1', startingBid: 100, highestBid: null },
    { id: '2', name: 'Item 2', startingBid: 200, highestBid: null },
];

// API to fetch auction items
app.get('/api/items', (req, res) => {
    res.json(auctionItems);
});

// API to place a bid
app.post('/api/bid', (req, res) => {
    const { itemId, bid } = req.body;
    const item = auctionItems.find((item) => item.id === itemId);

    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }

    if (bid <= (item.highestBid || item.startingBid)) {
        return res.status(400).json({ message: 'Bid must be higher than the current highest bid.' });
    }

    item.highestBid = bid;
    res.json({ message: 'Bid placed successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
