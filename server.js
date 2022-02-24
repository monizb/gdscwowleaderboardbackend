//starter express file
const express = require('express');
const app = express();
const { generateLeaderboard } = require('./functions/generateLeaderboard');
const { updateLeaderboardJob } = require('./jobs/updateOSLeaderboard');
const { generateQuizLeaderboard } = require('./functions/generateQuizLeaderboard');
const leaderboard = require('./leaderboard.json');
const fs = require('fs');
require('dotenv').config()

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

app.get("/quizLeaderboard/:workbookId/:sheetId", async function (req, res) {
    generateQuizLeaderboard(req.params.workbookId, req.params.sheetId, res);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port 3000');
});
