#!/usr/bin/env node
import dotenv from "dotenv";
import {ChannelFactory} from "./channelFactory";
import arg from "arg";
dotenv.config();
class Client {
    constructor(argv: any, token: string) {
        const {channels, dir} = this.parseArguments(argv);
        const channelFactory = new ChannelFactory(token, dir);

        if (channels) channels.forEach((channel: string) => channelFactory.getLoggedChannels(channel));
        // if (options.channelsP) options.channelsP.forEach((channel: string) => channelFactory.getLoggedChannels(channel, true));
        // if (options.im) options.im.forEach((channel: string) => channelFactory.getLoggedChannels(channel, true));
        // if (options.imp) options.imp.forEach((channel: string) => channelFactory.getLoggedChannels(channel, true));
    }
    parseArguments(rawArgs: any) {
        const args = arg(
            {
                "--im": String,
                "--c": String,
                "--cP": String,
                "--imp": String,
                "--dir": String,
            },
            {argv: rawArgs.slice(2)},
        );
        return {
            im: (args["--im"] || "").split(",") || false,
            channels: (args["--c"] || "").split(",") || false,
            channelsP: (args["--cP"] || "").split(",") || false,
            imp: (args["--imp"] || "").split(",") || false,
            dir: args["--dir"] || "/data",
        };
    }

    getMessages() {
        console.log("processing");
    }
}
if (process.env.TOKEN == undefined) {
    const ERROR_TOKEN = new Error("TOKEN NOT PRESENT");
    console.log(ERROR_TOKEN);
    process.exit(1);
}
const client = new Client(process.argv, process.env.TOKEN);
client.getMessages();
