const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const friendsFile = path.join(__dirname, "../data/friends.js");

let errorMessages = {
    firstSurvey: 'You are the first one answering the survey, so there are no people to connect you with'
    }

    router.get('/friends', (req, res) => {
    readFriendsFile((friends) => {
        res.json(friends)
    }, (err) => {
        res.status(500).json(err);
    });
    });

    router.post('/friends', (req, res) => {
    readFriendsFile((friends) => {
        let newUser = buildUser(req.body);
        let closestMatch = getClosestMatch(newUser, friends);

        friends.push(newUser);

        fs.writeFile(friendsFile, JSON.stringify(friends), () => {
        res.json({ friend: closestMatch });
        });
    }, (err) => {
        res.status(500).json(err);
    });
    });

    function readFriendsFile(onSuccess = (friends) => { }, onError = (err) => { }) {
    fs.readFile(friendsFile, "utf-8", (err, data) => {
        if (err) {
        onError(err);
        } else {
        let friends = data ? JSON.parse(data) : [];
        onSuccess(friends);
        }
    });
    }

    function buildUser(data) {
    let user = data
    user.scores = user.scores.map((score) => { return parseInt(score) });
    return user;
    }

    function getClosestMatch(newUser, availableFriends) {
    let closestMatch = undefined;
    let smallerDifference = undefined;

    availableFriends.forEach((potentialFriend) => {
        let difference = totalDifference(
        newUser.scores, potentialFriend.scores
        );

        if (closestMatch === undefined || difference < smallerDifference) {
        closestMatch = potentialFriend;
        smallerDifference = difference;
        }
    });

    return closestMatch;
    }

    function totalDifference(firstScores, secondScores) {
    return firstScores.reduce((totalDifference, score, index) => {
        return totalDifference + Math.abs(secondScores[index] - score)
    }, 0);
}

module.exports = router;