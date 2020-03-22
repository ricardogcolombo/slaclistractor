#!/usr/bin/env node
import dotenv from "dotenv";
import * as inquirer from "inquirer";
import fs from "fs";
import Client from './cli';

if (!fs.existsSync(".env")) {
    console.info("token file not found");
    inquirer
        .prompt({
            type: "input",
            name: "token",
            message: "What's your user token from slack?",
        })
        .then((answer: {token:string}) => {
            console.log(answer);
            fs.writeFile(".env", "TOKEN=" + answer.token, function(err) {
                if (err) throw err;
                dotenv.config();
                start(process);
            });
        });
} else {
    console.info("token file found");
    dotenv.config();
    start(process);
}

async function start(process: {env: any; argv: any}) {
    const client = new Client(process.env.TOKEN);
     await client.getMessages(process.argv);
}
