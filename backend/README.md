# 🎵 Spotify Clone Backend

A full-featured backend API for a Spotify clone application built with Node.js, Express, MongoDB, and Cloudinary.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Password hashing with bcrypt
  - Protected routes with role-based access control (Admin/User)

- **Song Management**
  - Upload songs with cover images to Cloudinary
  - Search, filter, and sort songs
  - Track play counts
  - Get trending/recent songs

- **Playlist Management**
  - Create, update, and delete playlists
  - Add/remove songs from playlists
  - Public and private playlists
  - User-specific playlist management

- **File Upload**
  - Audio file upload (MP3, WAV, M4A, etc.)
  - Image upload for cover art
  - Cloudinary integration for CDN delivery

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js      # Cloudinary configuration
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── playlistController.js
│   └── songController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   └── upload.js          # Multer file upload
├── models/
│   ├── Playlist.js        # Playlist schema
│   ├── Song.js            # Song schema
│   └── User.js            # User schema
├── routes/
│   ├── authRoutes.js
│   ├── playlistRoutes.js
│   └── songRoutes.js
├── .env.example
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file storage)

### Steps

1. **Clone the repository** (or navigate to the backend folder)

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Then edit `.env` with your credentials:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/spotify-clone
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spotify-clone

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB** (if using local MongoDB)

```bash
mongod
```

5. **Run the server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user profile | Protected |
| PUT | `/profile` | Update user profile | Protected |

### Song Routes (`/api/songs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all songs (with filters) | Public |
| GET | `/recent` | Get recent/trending songs | Public |
| GET | `/:id` | Get single song by ID | Public |
| PUT | `/:id/play` | Increment play count | Public |
| POST | `/upload` | Upload a new song | Admin |
| DELETE | `/:id` | Delete a song | Admin |

### Playlist Routes (`/api/playlists`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all public playlists | Public |
| GET | `/:id` | Get playlist by ID | Public |
| POST | `/` | Create a new playlist | Protected |
| GET | `/user/my-playlists` | Get user's playlists | Protected |
| PUT | `/:id/songs` | Add song to playlist | Protected |
| DELETE | `/:id/songs/:songId` | Remove song from playlist | Protected |
| DELETE | `/:id` | Delete playlist | Protected |

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Upload a Song (Admin only)

```bash
curl -X POST http://localhost:5000/api/songs/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "audio=@/path/to/song.mp3" \
  -F "coverImage=@/path/to/cover.jpg" \
  -F "title=Song Title" \
  -F "artist=Artist Name" \
  -F "album=Album Name" \
  -F "genre=Pop"
```

## 🗃️ Database Models

### User
- username, email, password
- profileImage, isPremium
- favoriteSongs[], playlists[]
- role (user/admin)

### Song
- title, artist, album, genre, year
- audioUrl, audioPublicId
- coverImageUrl, coverImagePublicId
- duration, playCount, likes
- uploadedBy (User reference)

### Playlist
- name, description, coverImage
- songs[] (Song references)
- owner (User reference)
- isPublic, followers

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Role-based access control
- File upload validation
- CORS configuration
- Input validation

## 🌐 Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your `.env` file

## 📝 Notes

- Default admin user must be created manually in the database (set role to 'admin')
- Audio files are uploaded to Cloudinary as 'video' resource type
- Maximum file sizes: 10MB for audio, 5MB for images
- JWT tokens expire after 30 days

## 🤝 Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

## 📄 License

MIT License

---

Built with ❤️ for music lovers
