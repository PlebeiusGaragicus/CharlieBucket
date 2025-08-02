const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Serve the main HTML file for all routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
// Create new player session
app.post('/api/player', (req, res) => {
  const playerUUID = uuidv4();
  
  // Set cookie with player UUID
  res.cookie('playerUUID', playerUUID, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ playerUUID });
});

// Update player username
app.put('/api/player/:uuid', (req, res) => {
  const { uuid } = req.params;
  const { playerName } = req.body;
  
  // Validate UUID format
  if (!uuid || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  
  // Validate playerName
  if (!playerName || playerName.trim().length === 0) {
    return res.status(400).json({ error: 'Player name is required' });
  }
  
  // Set cookie with player name and UUID
  res.cookie('playerName', playerName, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ success: true });
});

// Clear player session
app.delete('/api/session', (req, res) => {
  // Clear cookies
  res.clearCookie('playerUUID');
  res.clearCookie('playerName');
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
