const schedule = require('node-schedule');
const { generateLeaderboard } = require('../functions/generateLeaderboard');



function updateLeaderboardJob() {
    schedule.scheduleJob('*/30 * * * *', function () {
        console.log("========")
        console.log("Starting leaderboard updation job...");
        console.log("========")
        generateLeaderboard();
    });
}

module.exports.updateLeaderboardJob = updateLeaderboardJob;