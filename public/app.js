// Simple React-like implementation for the game platform

class GamePlatform {
    constructor() {
        this.playerUUID = this.getCookie('playerUUID');
        this.playerName = this.getCookie('playerName');
        this.render();
    }

    // Helper function to get cookie value by name
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Helper function to set cookie
    setCookie(name, value, days) {
        const expires = days ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}` : '';
        document.cookie = `${name}=${value}${expires}; path=/`;
    }

    // Helper function to clear cookie
    clearCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    // Create new player session
    async createPlayer() {
        try {
            const response = await fetch('/api/player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.playerUUID = data.playerUUID;
                this.setCookie('playerUUID', this.playerUUID, 1);
                this.render();
            } else {
                console.error('Failed to create player:', data.error);
            }
        } catch (error) {
            console.error('Error creating player:', error);
        }
    }

    // Update player username
    async updatePlayerName(playerName) {
        if (!this.playerUUID) {
            console.error('No player UUID found');
            return;
        }

        try {
            const response = await fetch(`/api/player/${this.playerUUID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playerName })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.playerName = playerName;
                this.setCookie('playerName', this.playerName, 1);
                this.render();
            } else {
                console.error('Failed to update player name:', data.error);
            }
        } catch (error) {
            console.error('Error updating player name:', error);
        }
    }

    // Clear player session
    async clearSession() {
        try {
            const response = await fetch('/api/session', {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.playerUUID = null;
                this.playerName = null;
                this.clearCookie('playerUUID');
                this.clearCookie('playerName');
                this.render();
            } else {
                console.error('Failed to clear session:', data.error);
            }
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    // Render the appropriate view based on player state
    render() {
        const root = document.getElementById('root');
        
        if (!this.playerUUID) {
            // Landing page - show "Let's play a game" button
            root.innerHTML = `
                <div class="container">
                    <h1>Game Platform</h1>
                    <button id="startButton" class="btn">Let's play a game</button>
                </div>
            `;
            
            document.getElementById('startButton').addEventListener('click', () => {
                this.createPlayer();
            });
        } else if (!this.playerName) {
            // Username selection page
            root.innerHTML = `
                <div class="container">
                    <h1>Choose Your Name</h1>
                    <input type="text" id="playerName" class="input-field" placeholder="Enter your name" />
                    <button id="submitName" class="btn">Continue</button>
                    <div id="errorMessage" class="error"></div>
                </div>
            `;
            
            document.getElementById('submitName').addEventListener('click', () => {
                const playerNameInput = document.getElementById('playerName');
                const playerName = playerNameInput.value.trim();
                
                if (playerName.length === 0) {
                    document.getElementById('errorMessage').textContent = 'Please enter a name';
                    return;
                }
                
                this.updatePlayerName(playerName);
            });
            
            // Allow Enter key to submit
            document.getElementById('playerName').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('submitName').click();
                }
            });
        } else {
            // Welcome screen
            root.innerHTML = `
                <div class="container">
                    <h1>Game Platform</h1>
                    <div class="welcome-message">Welcome, ${this.playerName}!</div>
                    <button id="restartButton" class="btn">Restart Game</button>
                </div>
            `;
            
            document.getElementById('restartButton').addEventListener('click', () => {
                this.clearSession();
            });
        }
    }
}

// Initialize the game platform when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GamePlatform();
});
