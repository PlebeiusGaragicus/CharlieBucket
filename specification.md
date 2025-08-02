# Web Application Specification: Game Platform

## Project Overview

This document specifies the requirements and architecture for a web-based game platform built with React and Node.js. The application will run on a Mac Studio using Docker containers.

## Technical Stack

### Frontend
- **React**: JavaScript library for building user interfaces
- **JavaScript/TypeScript**: Primary programming language
- **CSS/SCSS**: Styling framework

### Backend
- **Node.js**: Server-side runtime environment
- **Express.js**: Web application framework

### Infrastructure
- **Docker**: Containerization platform for consistent deployment
- **Mac Studio**: Development and deployment environment

## Core Features

### Landing Page
- Display a prominent "Let's play a game" button
- Upon clicking the button:
  - Generate a unique player identifier (UUID)
  - Store the UUID in a browser cookie
  - Allow user to proceed to username selection

### Player Session Handling
- When a client visits the page, the server checks for an existing player cookie
- If no valid cookie is found, the server assumes it's a new player and displays the "Let's play a game" button
- If a valid cookie is present, the server checks if it contains both "playerName" and "playerUUID"
- If the cookie contains both elements, the server recognizes the returning player and displays the welcome screen directly
- If the cookie exists but doesn't contain both required elements, the server treats the user as new and shows the landing page

### User Authentication Flow
- After cookie is set, present username input field
- Validate username input
- Display welcome message: "Welcome, <PLAYER_NAME>"
- Provide restart functionality

### Session Management
- Store player UUID in browser cookies
- Allow users to restart the game by clearing cookies
- Maintain session state across page reloads

## User Interface Requirements

### Initial State
- Clean landing page with centered "Let's play a game" button
- Responsive design for various screen sizes

### Game Flow
1. **Landing Page**: 
   - Large, prominent button to start the game
   - Simple, intuitive design

2. **Username Selection**:
   - Input field for player name
   - Validation for name input
   - Submit button to proceed

3. **Welcome Screen**:
   - Personalized welcome message
   - Restart button to clear session and return to landing page

### Technical Requirements
- All cookies must be stored with appropriate security flags
- Session persistence across browser sessions
- Responsive design that works on desktop and mobile devices

## Architecture

### Frontend Architecture
- React components for UI elements
- State management for game flow
- Cookie handling utilities
- API client for backend communication

### Backend Architecture
- RESTful API endpoints
- Session management middleware
- UUID generation service

### Docker Configuration
- Multi-container setup (frontend, backend)
- Environment variable management
- Port mapping configuration

## Implementation Details

### Cookie Management
- Store player UUID and playerName in browser cookies with appropriate security settings
- Set cookie expiration to session duration
- Implement cookie removal on restart

### Server-Side Cookie Validation
- On each page request, the server examines incoming HTTP requests for player cookies
- If no valid player cookie is found, the server responds with the landing page containing the "Let's play a game" button
- If a valid player cookie is present, the server checks if it contains both playerName and playerUUID
- If both elements are present, the server responds with the welcome screen
- If the cookie exists but doesn't contain both required elements, the server treats the user as new and shows the landing page

### UUID Generation
- Generate unique identifiers using standard UUID v4 algorithm
- Ensure uniqueness across all players

### API Endpoints (Backend)
- `POST /api/player` - Create new player session
- `PUT /api/player/:uuid` - Update player username
- `DELETE /api/session` - Clear player session

## Security Considerations

### Cookie Security
- Set secure flag on cookies (HTTPS only)
- Set SameSite attribute for CSRF protection
- Implement proper cookie expiration

### Data Validation
- Validate all user inputs
- Sanitize username input to prevent XSS attacks
- Implement rate limiting for API endpoints

## Development Environment Setup

### Prerequisites
- Node.js (v16 or higher)
- Docker Desktop for Mac
- npm or yarn package manager

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Start Docker containers: `docker-compose up`
4. Access application at `http://localhost:3000`

## Testing Strategy

### Frontend Testing
- Unit tests for React components
- Integration tests for user flow
- E2E tests for complete game flow

### Backend Testing
- API endpoint testing
- Session management validation

## Deployment

### Production Environment
- Docker containers for all services
- Reverse proxy configuration (nginx)
- SSL certificate management
- Monitoring and logging setup
