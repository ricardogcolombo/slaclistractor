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

                //aliases
                "-c": "--channel",
                "-d": "--dir",
                "-m": "--directmessage",
            },
            {
                argv: rawArgs.slice(2),
                permissive: true,
            },
        );
        return {
            im: (args["-m"] || args["--directmessage"] || "").split(",").filter((item) => item.length > 0) || false,
            channels: (args["-c"] || args["--channel"] || "").split(",").filter((item) => item.length > 0) || false,
            dir: args["-d"] || args["--dir"] || "./data",
        };
    }

    async getMessages(argv: any) {
        const {channels, im, dir} = this.parseArguments(argv);
        const channelFactory = new MessageExtractor(this.token, dir);
        await channelFactory.getData(channels, im);
    }
}
