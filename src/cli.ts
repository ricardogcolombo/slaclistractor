import arg from "arg";
import {MessageExtractor} from "./messages";

export default class Client {
    private token = "";
    constructor(token: string) {
        this.token = token;
    }
    parseArguments(rawArgs: any) {
        const args = arg(
            {
                "--directmessage": String,
                "--channel": String,
                "--dir": String,
                "--group":String,

                //aliases
                "-c": "--channel",
                "-d": "--dir",
                "-m": "--directmessage",
                "-g": "--group",
            },
            {
                argv: rawArgs.slice(2),
                permissive: true,
            },
        );
        return {
            im: (args["-m"] || args["--directmessage"] || "").split(",").filter((item) => item.length > 0) || [],
            group: (args["-g"] || args["--group"] || "").split(",").filter((item) => item.length > 0) || [],
            channels: (args["-c"] || args["--channel"] || "").split(",").filter((item) => item.length > 0) || [],
            dir: args["-d"] || args["--dir"] || "./data",
        };
    }

    async getMessages(argv: any) {
        const {channels, im, dir,group} = this.parseArguments(argv);
        const channelFactory = new MessageExtractor(this.token, dir);
        await channelFactory.getData(channels, im,group);
    }
}
