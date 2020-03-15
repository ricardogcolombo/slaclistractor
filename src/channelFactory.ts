import axios from "axios";
import fs from "fs";
import {Core} from "./core";

export class ChannelFactory extends Core {
    private endpoint = "users.conversations";
    constructor(token: string, dir: string) {
        super(token, dir,'/channels.json');
        this.saveChannels();
    }
    private async saveChannels() {
        return this.getAbstractList(this.getChannels,this.saveData)
    }
    public getChannelsHistory(channels: string[]) {
        console.log("getData" + channels);
    }
    private getChannels = () =>
        this.getPublic(this.endpoint) + "&types=private_channel,public_channel,im,mpim";
    private saveData = (channels:any)=>{
        this.dataList=this.dataList.concat(channels)
    }
    private getHistory = (channelName: string) =>
        this.SLACK_URL + this.endpoint + "history?token=" + this.TOKEN + "&channel=" + channelName;

    getChannelsName = (list: {data: {channels: any[]}}) =>
        list.data.channels.map((item: {name: string; id: string}) => {
            return {name: item.name, id: item.id};
        });

    getLoggedChannels = async (channel: string) => {
        let nextCursor = true;
        let originalUrl = this.getChannels();
        let url = originalUrl;
        let c_data;

        while (nextCursor) {
            console.log(url);
            let {
                data: {channels, response_metadata},
            } = await axios.get(url);
            let [c] = channels.filter((name: string) => name == channel);
            nextCursor = !c && response_metadata ? !!response_metadata.next_cursor : false;
            c_data = c ? c : null;
            url = this.next(response_metadata.next_cursor, originalUrl);
        }
        if (c_data) {
            this.getHistoryData(c_data);
        }
    };
    getHistoryData = async (channel: {name: string; id: string}) => {
        console.log("Downloading data from " + channel.name);
        let history = [];

        let nextCursor = true;
        let originalUrl = this.getHistory(channel.id);
        let url = originalUrl;
        while (!!nextCursor) {
            console.log(url);
            const {
                data: {messages, response_metadata},
            } = await axios.get(url);
            if (messages) {
                history.push(messages);
            }
            let nextCursorString: string = response_metadata ? response_metadata.next_cursor : "";
            nextCursor = nextCursorString != "";
            console.log(response_metadata);
            url = this.next(nextCursorString, originalUrl);
        }

        if (history.length > 0) {
            if (!fs.existsSync(this.dir)) {
                fs.mkdirSync(this.dir, 0o766);
            }
            fs.writeFile(this.dir + channel.name + ".json", JSON.stringify(history), function(err) {
                if (err) return console.log(err);
            });
        }
    };
}
