const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure downloads directory exists
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)){
    fs.mkdirSync(downloadDir);
}

// Route to get video info
app.get('/video-info', async (req, res) => {
    try {
        const videoUrl = req.query.url;

        // Validate YouTube URL
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get video info
        const info = await ytdl.getBasicInfo(videoUrl);
        const videoDetails = info.videoDetails;

        res.json({
            title: videoDetails.title,
            thumbnail: videoDetails.thumbnails[0].url,
            duration: videoDetails.lengthSeconds,
            author: videoDetails.author.name
        });

    } catch (error) {
        console.error('Video info error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch video info', 
            details: error.message 
        });
    }
});

// Route to download YouTube video as MP3
app.get('/download', async (req, res) => {
    try {
        const videoUrl = req.query.url;

        // Validate YouTube URL
        if (!ytdl.validateURL(videoUrl)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get video info
        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title
            .replace(/[\/\?<>\\:\*\|":]|^\./g, '') // Remove invalid filename characters
            .trim();

        const outputPath = path.join(downloadDir, `${title}.mp3`);
        
        // Download video and convert to MP3
        const video = ytdl(videoUrl, { 
            quality: 'highestaudio',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        });

        ffmpeg(video)
            .toFormat('mp3')
            .on('error', (err) => {
                console.error('Conversion error:', err);
                res.status(500).json({ error: 'Conversion failed', details: err.message });
            })
            .on('end', () => {
                res.download(outputPath, `${title}.mp3`, (err) => {
                    if (err) {
                        console.error('Download error:', err);
                        res.status(500).json({ error: 'Download failed', details: err.message });
                    }
                    // Optional: Remove file after download
                    // fs.unlinkSync(outputPath);
                });
            })
            .save(outputPath);

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ 
            error: 'Download failed', 
            details: error.message 
        });
    }
});

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`YouTube MP3 Downloader running on http://localhost:${port}`);
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
