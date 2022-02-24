var axios = require('axios');
require('dotenv').config()

async function generateQuizLeaderboard(workbookId, sheetId, res) {
    axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${workbookId}/values/${sheetId}!A2:B?key=${process.env.SHEETS_KEY}`)
        .then(async function (response) {
            let leaderboard = [];
            let data = response.data.values;
            for (let i = 0; i < data.length; i++) {
                if (!leaderboard[data[i][0]]) {
                    leaderboard.push({
                        name: data[i][1],
                        position: i + 1,
                    })
                }
            }
            res.send({ success: true, leaderboard: leaderboard });
        })
        .catch(function (err) {
            res.send("Invalid workbookId or sheetId");
        }
        );
}


module.exports.generateQuizLeaderboard = generateQuizLeaderboard;