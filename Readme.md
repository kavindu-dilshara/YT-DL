# YouTube MP3 Downloader

## Prerequisites
- Node.js (v14 or later)
- FFmpeg installed on your system

## Installation

1. Clone the repository:
```bash
git clone https://your-repo-url.git
cd youtube-mp3-downloader
```

2. Install dependencies:
```bash
npm install
```

3. Install FFmpeg:
- On Windows: Download from https://ffmpeg.org/download.html and add to PATH
- On macOS: `brew install ffmpeg`
- On Ubuntu/Debian: `sudo apt-get install ffmpeg`

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Usage
1. Open `http://localhost:3000` in your browser
2. Paste a YouTube video URL
3. Click "Download MP3"

## Important Notes
- Ensure you have the right to download and use the music
- Respect copyright laws
- This is for personal use only

## Troubleshooting
- Check that FFmpeg is correctly installed
- Verify you have the latest Node.js version
- Ensure YouTube URL is valid

## Dependencies
- Express.js
- ytdl-core
- fluent-ffmpeg
