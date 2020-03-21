import fs from "fs";
import axios from "axios";

export class Core {
    protected _token = "";
    protected _dir = "";
    protected datafile = "";
    protected SLACK_URL = "https://slack.com/api/";
    protected idDictionary= new Map();
    protected nameDictionary = new Map();
    constructor(token: string, dir: string, datafile?: string) {
        this._token = token || "";
        this._dir = dir || "";
        this.datafile = datafile || "";
        this.checkDirectory();
    }
    set token(token: string) {
        this._token = token;
    }
    get token(){
        return this._token;
    }
    set dir(directory: string) {
        this._dir = directory;
    }
    get dir(){
        return this._dir;
    }
    protected next = (nextCursor: string, url: string) => url + "&cursor=" + nextCursor;
    protected getPublic = (endpoint: string) => this.SLACK_URL + endpoint + "?token=" + this._token;

    protected checkDirectory() {
        if (!fs.existsSync(this._dir)) {
            fs.mkdirSync(this._dir);
        }
    }
    async getDataFile(getUrl: () => string) {
        if (this._dir.length === 0 || this.datafile.length == 0) {
            throw new Error("Directory or Data File not defined");
        }
        const cFile = this._dir + this.datafile;
        if (!fs.existsSync(cFile)) {
            console.info("getting data from slack api");
            let nextCursor = true;
            let originalUrl = getUrl();
            let url = originalUrl;
            while (nextCursor) {
                console.info(url);
                let {
                    data: {channels, members, response_metadata},
                } = await axios.get(url);
                if (channels) {
                    console.info("get channels");
                    channels.forEach((item: {name: string,id:string}) => {
                        this.idDictionary.set(item.id, item);
                        this.nameDictionary.set(item.name, item);
                    });
                } else if(members){
                    console.info("get users");
                    members.forEach((item:{user: string,id:string}) => {
                        this.nameDictionary.set(item.user, item);
                        this.idDictionary.set(item.id, item);
                    });
                }else{
                    console.info('not members or channels present')
                }
                if (response_metadata && response_metadata.next_cursor) {
                    url = this.next(response_metadata.next_cursor, originalUrl);
                } else {
                    nextCursor = false;
                }
            }
            if (this.idDictionary.size > 0)
                console.log(cFile)
                fs.writeFile(cFile, JSON.stringify(Array.from(this.idDictionary.entries()).map(item=>item[1])), "utf8", (err) => {
                    if (err) throw err;
                    console.log("Channels Saved to file");
                });
        } else {
            await this.readFile(cFile);
        }
    }
    async readFile(fileName: string) {
        let _self = this;
        return new Promise((resolve, reject) => {
            fs.readFile(fileName, "utf8", function(error, data: string) {
                if (error) throw reject(error);
                _self.idDictionary= new Map();
                _self.nameDictionary= new Map();
                JSON.parse(data).forEach((item:{name:string,id:string,user:string})=>{
                    _self.nameDictionary.set(item.name||item.user,item)
                    _self.idDictionary.set(item.id,item)
                })
                resolve();
            });
        });
    }
    async saveFile(channelName: string, data: any) {
        this.checkDirectory();
        return new Promise((resolve, reject) => {
            fs.writeFile(this._dir + "/" + channelName + ".json", data, function(err) {
                if (err) return reject(err);
                console.log(channelName + " file saved");
                resolve();
            });
        });
    }
}
