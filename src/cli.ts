#!/usr/bin/env node
import dotenv from "dotenv";
import arg from "arg";
import {MessageExtractor} from './messages'

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
            im: (args["-m"] ||args["--directmessage"]|| "").split(",").filter(item=>item.length>0) || false,
            channels: (args["-c"] || args["--channel"]|| "").split(",").filter(item=>item.length>0) || false,
            dir: (args["-d"] ||args["--dir"]|| "./data")
        };
    }

    getMessages(argv:any) {
        const {channels,im, dir} = this.parseArguments(argv);
        const channelFactory= new MessageExtractor(this.token, dir);
        channelFactory.getData(channels,im)
    }
}
if (process.env.TOKEN == undefined) {
    const ERROR_TOKEN = new Error("TOKEN NOT PRESENT");
    console.log(ERROR_TOKEN);
    process.exit(1);
}
const client = new Client(process.env.TOKEN);
client.getMessages(process.argv);
