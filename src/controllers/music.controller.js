const musicModel = require('../models/music.model');
const { uploadFile } = require('../services/stroage.services');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

function extractToken(req) {
    const cookieToken = req.cookies && req.cookies.token;
    if (cookieToken) return cookieToken;

    const authorizationHeader = req.headers.authorization || req.headers.Authorization;
    if (!authorizationHeader) return null;

    if (authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.split(' ')[1];
    }

    return authorizationHeader;
}

async function createMusic(req, res) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (decoded.role !== 'artist') {
        return res.status(403).json({ message: "You don't have access to create music" });
    }

    const title = req.body.title;
    const file = req.file;

    if (!file || !file.buffer) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const base64 = file.buffer.toString('base64');
        const result = await uploadFile(base64);

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        });

        return res.status(201).json({
            message: 'Music Created Successfully',
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (err) {
        console.error('createMusic error:', err);
        return res.status(500).json({ message: 'Failed to upload or save music', error: err.message });
    }
}

module.exports = { createMusic };