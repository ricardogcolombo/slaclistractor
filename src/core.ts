import fs from "fs";
import axios from "axios";
import util from "util";

export class Core {
    protected TOKEN = "";
    protected dir = "";
    protected datafile = "";
    protected SLACK_URL = "https://slack.com/api/";
    protected dataList = new Map();
    constructor(token: string, dir: string, datafile?: string) {
        this.TOKEN = token;
        this.dir = dir;
        this.datafile = datafile || "";
        this.checkDirectory();
    }
    protected next = (nextCursor: string, url: string) => url + "&cursor=" + nextCursor;
    protected getPublic = (endpoint: string) => this.SLACK_URL + endpoint + "?token=" + this.TOKEN;

    protected checkDirectory() {
        if (!fs.existsSync(this.dir)) {
            fs.mkdirSync(this.dir);
        }
    }
    async getDataFile(getUrl: () => string) {
        if (this.dir.length === 0 || this.datafile.length == 0) {
            throw new Error("Directory or Data File not defined");
        }
        const cFile = this.dir + this.datafile;
        if (!fs.existsSync(cFile)) {
            console.log("getting data from slack api");
            let nextCursor = true;
            let originalUrl = getUrl();
            let url = originalUrl;
            while (nextCursor) {
                console.log(url);
                let {
                    data: {channels, members, response_metadata},
                } = await axios.get(url);
                if (channels) {
                    channels.forEach((item: {name: string}) => {
                        console.log(item.name);
                        this.dataList.set(item.name, item);
                    });
                } else {
                    members.forEach((item: {name: string}) => this.dataList.set(item.name, item));
                }
                if (response_metadata && response_metadata.next_cursor) {
                    url = this.next(response_metadata.next_cursor, originalUrl);
                } else {
                    nextCursor = false;
                }
            }
            if (this.dataList.size > 0)
                fs.writeFile(cFile, JSON.stringify(this.dataList), "utf8", (err) => {
                    if (err) throw err;
                    console.log("Channels Saved to file");
                });
        } else {
            await this.readFile(cFile);
        }
    }
    readFile = (fileName: string) => {
        let _self = this;
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, "utf8", function(error, data: string) {
                if (error) throw reject(error);
                console.log("test1");
                const items = JSON.parse(data);
                items.forEach((item: {name: string; id: string}) => _self.dataList.set(item.name || item.id, item));
                resolve();
            });
        });
    };
    saveFile = (channelName: string,data:any) => {
        this.checkDirectory();
        return new Promise((resolve, reject) => {
            fs.writeFile(this.dir + "/" + channelName + '.json', data, function(err) {
                if (err) return reject(err);
                console.log(channelName + "data file saved");
                resolve();
            });
        });
    };
}
