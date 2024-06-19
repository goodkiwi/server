const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use environment port or 3000 if not specified

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = process.env.MONGO_URI; // MongoDB connection URI from environment variables

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db('typingtest'); // Connect to the 'typingtest' database
        const scoresCollection = db.collection('scores'); // 'scores' collection

        // Save score endpoint
        app.post('/saveScore', (req, res) => {
            const { userID, timeTaken, accuracy } = req.body;
            const score = { userID, timeTaken, accuracy, date: new Date() };

            scoresCollection.insertOne(score)
                .then(result => {
                    console.log('Score saved successfully:', result.ops[0]);
                    res.status(200).json(result.ops[0]);
                })
                .catch(error => {
                    console.error('Error saving score:', error);
                    res.status(500).json({ error: 'Error saving score' });
                });
        });

        // Start server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });

