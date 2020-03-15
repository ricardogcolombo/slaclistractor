import fs from 'fs';

export class Core {
    protected TOKEN = "";
    protected dir = "";
    protected SLACK_URL = "https://slack.com/api/";

    constructor(token: string, dir: string) {
        this.TOKEN = token;
        this.dir = dir;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    protected next = (nextCursor: string, url: string) => url + "&cursor=" + nextCursor;
    protected getPublic = (endpoint: string) => this.SLACK_URL + endpoint + "?token=" + this.TOKEN;
}
