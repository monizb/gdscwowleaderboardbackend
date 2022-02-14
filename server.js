//starter express file
const express = require('express');
const app = express();
const { generateLeaderboard } = require('./functions/generateLeaderboard');
const { updateLeaderboardJob } = require('./jobs/updateOSLeaderboard');
const leaderboard = require('./leaderboard.json');
const fs = require('fs');

app.use(express.json());

generateLeaderboard();
updateLeaderboardJob();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/OSLeaderboard", (req, res) => {
    fs.readFile('leaderboard.json', 'utf8', function (err, data) {
        if (err) throw err;
        let obj = JSON.parse(data);
        res.send(obj);
    });
});

app.listen(3001, () => {
    console.log('Server started on port 3000');
});
