var projects = require("../projects.json");
var fs = require("fs");
var axios = require('axios');
require('dotenv').config()

const timer = ms => new Promise(res => setTimeout(res, ms))
let leaderboard = {};

async function generateLeaderboard() {
    leaderboard = {};
    console.log(projects);
    let identifyingLabel = "gdscwow";
    let labels = [{
        label: "wow 1",
        points: 140
    }, {
        label: "wow 2",
        points: 80
    }, {
        label: "wow 3",
        points: 30
    }]
    for (let m = 0; m < projects.length; m++) {
        await axios.get(`https://api.github.com/search/issues?q=repo:${projects[m].Repository}+is:pr+label:${identifyingLabel}+is:merged&per_page=100`, {
            headers: {
                Authorization: 'token ' + process.env.GIT_KEY
            }
        }).then(async function (response) {
            if (response.data.items && response.data.items.length > 0) {
                let prs = response.data.items;
                for (let i = 0; i < prs.length; i++) {
                    for (let j = 0; j < prs[i].labels.length; j++) {
                        if (!leaderboard[prs[i].user.id]) {
                            leaderboard[prs[i].user.id] = {
                                avatar_url: prs[i].user.avatar_url,
                                login: prs[i].user.login,
                                url: prs[i].user.html_url,
                                score: 0,
                                pr_urls: [],
                            }
                            //convert labels to keys

                        }
                        if (leaderboard[prs[i].user.id].pr_urls.indexOf(prs[i].html_url) == -1) {
                            leaderboard[prs[i].user.id].pr_urls.push(prs[i].html_url);
                        }
                        let obj = labels.find(o => o.label === prs[i].labels[j].name);
                        if (obj) {
                            leaderboard[prs[i].user.id].score += obj.points;
                        }

                    }
                }
                if (response.data.total_count > 100) {
                    //calculate number of pages
                    let pages = Math.ceil(response.data.total_count / 100);
                    console.log("========")
                    console.log("No. of pages: " + pages);
                    console.log(`https://api.github.com/search/issues?q=repo:${projects[m].Repository}+is:pr+label:${identifyingLabel}+is:merged`);
                    console.log("========")
                    for (let i = 2; i <= pages; i++) {
                        console.log("Page: " + i);
                        let paginated = await axios.get(`https://api.github.com/search/issues?q=repo:${projects[m].Repository}+is:pr+label:${identifyingLabel}+is:merged&per_page=100&page=${i}`, {
                            headers: {
                                Authorization: 'token ' + process.env.GIT_KEY
                            }
                        }).then(async function (response) {
                            console.log("*****" + response.data.items.length);
                            if (response.data.items && response.data.items.length > 0) {
                                let prs = response.data.items
                                for (let i = 0; i < prs.length; i++) {
                                    for (let j = 0; j < prs[i].labels.length; j++) {
                                        if (!leaderboard[prs[i].user.id]) {
                                            leaderboard[prs[i].user.id] = {
                                                avatar_url: prs[i].user.avatar_url,
                                                login: prs[i].user.login,
                                                url: prs[i].user.html_url,
                                                score: 0,
                                                pr_urls: [],
                                            }
                                        }
                                        if (leaderboard[prs[i].user.id].pr_urls.indexOf(prs[i].html_url) == -1) {
                                            leaderboard[prs[i].user.id].pr_urls.push(prs[i].html_url);
                                        }
                                        let obj = labels.find(o => o.label === prs[i].labels[j].name);
                                        if (obj) {
                                            leaderboard[prs[i].user.id].score += obj.points;
                                        }

                                    }
                                }
                            }
                            console.log("Completed page: " + i);

                        })
                        await timer(7000);
                    }
                }

            }
        }).catch(function (err) {
            // console.log(err);
        }
        )
        console.log("Completed " + m + " of " + projects.length);
        await timer(7000);
    }
    // wait for all the prs to be fetched
    console.log("Leaderboard generated");
    //sort the leaderboard by score
    let leaderboardArray = Object.keys(leaderboard).map(key => leaderboard[key]);
    leaderboardArray.sort((a, b) => b.score - a.score);
    let json = {
        leaderboard: leaderboardArray,
        success: true,
        updatedAt: +new Date()
    }
    fs.truncate('leaderboard.json', 0, function () { console.log('done') })
    fs.writeFile('leaderboard.json', JSON.stringify(json), 'utf8', function (err) {
        if (err) throw err;
        console.log('leaderboard.json was updated');
    });
}

module.exports.generateLeaderboard = generateLeaderboard;