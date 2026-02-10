const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Connect to MongoDB (use MONGODB_URI env var in production)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/notes', require('./routes/notes'));
app.use('/', require('./routes/bfhl'));

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
