# 🎵 Spotify Clone Frontend

A modern, responsive frontend for the Spotify clone application built with React, Vite, TailwindCSS, and Zustand.

## 🚀 Features

- **Modern UI/UX**
  - Dark mode design inspired by Spotify
  - Responsive layout for desktop and mobile
  - Glassmorphism effects and smooth transitions

- **Music Player**
  - Persistent playback bar
  - Play, pause, skip, shuffle, and repeat controls
  - Volume control and progress seeking
  - Queue management

- **Music Discovery**
  - Home page with featured playlists and recent songs
  - Search functionality (upcoming)
  - Playlist management

- **User Features**
  - User authentication (Login/Register)
  - Song upload (Admin only)
  - Profile management

## 🛠️ Tech Stack

- **React**: UI library
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling framework
- **Zustand**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hot Toast**: Notifications
- **React Icons**: Icon library

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Player.jsx       # Audio player component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── SongCard.jsx     # Song display card
│   ├── pages/
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # Auth page
│   │   └── Upload.jsx       # Song upload page
│   ├── services/
│   │   └── api.js           # API service calls
│   ├── store/
│   │   └── store.js         # Zustand state store
│   ├── utils/
│   │   └── api.js           # Axios configuration
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- Backend server running on port 5000

### Steps

1. **Clone the repository** (or navigate to the frontend folder)

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

The default configuration assumes the backend is running on `http://localhost:5000/api`. If your backend is running elsewhere, update `VITE_API_URL`.

4. **Run the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or the port shown in the terminal).

## 📱 Usage

1. **Register/Login**: Create an account to start listening.
2. **Upload Music**: If you have admin privileges, navigate to `/upload` to add new songs.
3. **Play Music**: Click on any song card to start playback. use the player controls at the bottom to manage playback.

## 🤝 Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

## 📄 License

MIT License
