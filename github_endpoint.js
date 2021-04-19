const fs = require('fs');
const express = require("express");
const axios = require("axios");

const app = express();

let repoCount = 0;

app.get('/api/github/:username', (request, response) => {
    // console.log(request.params.username)
    fs.readFile(request.params.username + '.txt', 'utf8', (error, data) => {
        if (error) { // file note found = need to use axios get request
            const promise = axios.get('https://api.github.com/users/' + request.params.username, {
                headers: {
                    Accept: 'application/json',
                }
            });
            promise.then((githubResponse) => {
                repoCount = githubResponse.data.public_repos
                // console.log(repoCount)
                response.json({"repoCount":repoCount});
            })
            .then(() => {
                fs.writeFile(request.params.username + '.txt', repoCount.toString(), (error)=> {
                    console.log("wrote repoCount into file");
                })
            })
        } else {
            console.log("reading repoCount from file")
            response.json({
                "repoCount":Number(data)
            });
            response.end();
        }  
    })
});
app.listen(8000);