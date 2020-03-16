#!/usr/bin/env node
import dotenv from "dotenv";
import {ChannelFactory} from "./channelFactory";
import arg from "arg";
dotenv.config();
class Client {
    private token='';
    constructor(token:string){
        this.token = token;
    }
    parseArguments(rawArgs: any) {
        const args = arg(
            {
                "-d": String,
                "-m": String,
                "--directmessage": String,
            
                "-c": String,
                "--channel": String,
                "--dir": String,
            },
            {argv: rawArgs.slice(2)},
        );
        return {
            im: (args["-m"] ||args["--directmessage"]|| "").split(",") || false,
            channels: (args["-c"] || args["--channel"]|| "").split(",") || false,
            dir: (args["-d"] ||args["--dir"]|| "./data")
        };
    }

    getMessages(argv:any) {
        const {channels, dir} = this.parseArguments(argv);
        const channelFactory= new ChannelFactory(this.token, dir);
        channelFactory.getData(channels)
    }
}
if (process.env.TOKEN == undefined) {
    const ERROR_TOKEN = new Error("TOKEN NOT PRESENT");
    console.log(ERROR_TOKEN);
    process.exit(1);
}
const client = new Client(process.env.TOKEN);
client.getMessages(process.argv);
