import fs from "fs";
import axios from 'axios';
export class Core {
    protected TOKEN = "";
    protected dir = "";
    protected datafile = "";
    protected SLACK_URL = "https://slack.com/api/";
    protected dataList = [];
    constructor(token: string, dir: string,datafile?:string) {
        this.TOKEN = token;
        this.dir = dir;
        this.datafile = datafile|| "";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    protected next = (nextCursor: string, url: string) => url + "&cursor=" + nextCursor;
    protected getPublic = (endpoint: string) => this.SLACK_URL + endpoint + "?token=" + this.TOKEN;

    async getAbstractList(getUrl:()=>string,saveFn:any ) {
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
                    data: {channels,members, response_metadata},
                } = await axios.get(url);
                saveFn(channels||members)
                if (response_metadata && response_metadata.next_cursor) {
                    url = this.next(response_metadata.next_cursor, originalUrl);
                } else {
                    nextCursor = false;
                }
            }
            if (this.dataList.length > 0)
                fs.writeFile(cFile, JSON.stringify(this.dataList), "utf8", (err) => {
                    if (err) throw err;
                    console.log("Channels Saved to file");
                });
        } else {
            fs.readFile(cFile, "utf8", (err, contents: string) => {
                if (err) throw err;
                console.log("read channels file");
                this.dataList= JSON.parse(contents);
            });
        }
    }
}
