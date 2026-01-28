# Vora: API-First Video Streamer

A production-ready Full Stack application with a Flask Backend, MongoDB Atlas Database, and React Native (Expo) Frontend.

## Architecture
- **Backend**: Flask API handling Authentication (JWT), Data Modeling (MongoDB), and Video Masking logic.
- **Frontend**: React Native "Thin Client" focusing solely on UI/UX and API consumption.
- **Security**: Password hashing with Bcrypt, JWT for session management, and URL abstraction to hide raw video sources.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` folder.
2. Create a `.env` file based on `.env.example`.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database (optional but recommended):
   ```bash
   python seed_db.py
   ```
5. Run the server:
   ```bash
   python app.py
   ```

### 2. Frontend Setup
1. Navigate to the `mobile` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `services/api.js` with your computer's local IP address if using a physical device.
4. Start the app:
   ```bash
   npx expo start
   ```

## Video Abstract Strategy
The mobile app NEVER sees the raw YouTube URL. It fetches a masked stream URL from the backend, which then resolves to a secure embed link. This ensures content security and allows for backend control over video sources.
