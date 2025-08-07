// index.js

const express = require('express');
const { nanoid } = require('nanoid');
const admin = require('firebase-admin');

// --- Firebase Initialization ---
// IMPORTANT: You need to set up a Firebase project and get your service account key.
// 1. Go to your Firebase project settings > Service accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. Save it securely in your project directory (e.g., as 'serviceAccountKey.json').
// 4. Make sure to add this file to your .gitignore to keep it private!
try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("Error: Firebase serviceAccountKey.json not found.");
    console.error("Please follow the setup instructions in the code comments.");
    process.exit(1);
}


const db = admin.firestore();
const app = express();
const port = 3000;

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies
app.use((req, res, next) => { // Basic CORS middleware
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// --- API Routes ---

/**
 * @route   POST /shorten
 * @desc    Create a new shortened URL
 * @access  Public
 */
app.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;

    // Basic URL validation
    if (!longUrl || !isValidUrl(longUrl)) {
        return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    try {
        // Generate a unique short slug (e.g., 'aB1cD2eF')
        const slug = nanoid(8);
        const shortUrl = `http://localhost:${port}/${slug}`;

        // Store the mapping in Firestore
        // We use the slug as the document ID for fast lookups
        const urlRef = db.collection('urls').doc(slug);
        await urlRef.set({
            longUrl: longUrl,
            slug: slug,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`URL shortened: ${longUrl} -> ${shortUrl}`);
        res.status(201).json({ shortUrl });

    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

/**
 * @route   GET /:slug
 * @desc    Redirect to the original long URL
 * @access  Public
 */
app.get('/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const urlRef = db.collection('urls').doc(slug);
        const doc = await urlRef.get();

        if (doc.exists) {
            const { longUrl } = doc.data();
            console.log(`Redirecting ${slug} to ${longUrl}`);
            // Perform the redirect
            return res.redirect(301, longUrl);
        } else {
            // If the slug doesn't exist, send a 404 Not Found response
            return res.status(404).json({ error: 'URL not found.' });
        }
    } catch (error) {
        console.error('Error redirecting URL:', error);
        return res.status(500).json({ error: 'Server error.' });
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`URL shortener backend listening at http://localhost:${port}`);
});


// --- Helper Function ---
/**
 * Validates if a given string is a valid URL.
 * @param {string} urlString - The string to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (error) {
        return false;
    }
}
