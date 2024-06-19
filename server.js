const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = "mongodb+srv://supriyaskrishnamurthy:3*9YellowDucks@typingtest.xn6rknk.mongodb.net/typingtest?retryWrites=true&w=majority"; // Replace with your MongoDB connection string

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db('typingtest'); // Connect to the 'typingtest' database

        // Ensure 'scores' collection exists
        const scoresCollection = db.collection('scores');

        // Save score endpoint
        app.post('/saveScore', (req, res) => {
            const { userID, timeTaken, accuracy } = req.body;
            const score = { userID, timeTaken, accuracy, date: new Date() };

            scoresCollection.insertOne(score, (err, result) => {
                if (err) {
                    console.error('Error saving score:', err);
                    return res.status(500).json({ error: 'Error saving score' });
                }
                console.log('Score saved successfully:', result.ops[0]);
                return res.status(200).json(result.ops[0]);
            });
        });


        // Start server
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
    });
