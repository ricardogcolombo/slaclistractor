import axios from "axios";
import {Core} from "./core";
import { UserHandler } from "./users";

export class ChannelsManager extends Core {
    private endpoint = "users.conversations";
    private conversations = "conversations.history";
    private _users:UserHandler;
    constructor(token: string, dir: string) {
        super(token, dir, "/channels.json");
    }
    async loadChannels() {
        return this.getDataFile(this.getChannels);
    }
    public async getChannelsHistory(channels: string[]) {
        var names = channels.map(item=>{
            if(this.dataList.has(item)){
                    return item;
            }else{
                console.log("channel "+item+" does not exists");
            }
        }).filter(item=>this.dataList.has(item))
        var calls = names.map(async (item) => {
            const channelInfo = this.dataList.get(item);
            return await this.getHistoryData(channelInfo);
        });
        return Promise.all(calls);
    }
    private getChannels() {
        return this.getPublic(this.endpoint) + "&types=private_channel,public_channel,im,mpim";
    }

    private getHistory(channelName: string) {
        return this.SLACK_URL + this.conversations + "?token=" + this.TOKEN + "&channel=" + channelName;
    }

    getChannelsName(list: {data: {channels: any[]}}) {
        return list.data.channels.map((item: {name: string; id: string}) => {
            return {name: item.name, id: item.id};
        });
    }

    async getHistoryData(channel: {name: string; id: string}) {
        const _self = this;
        return new Promise(async function(resolve) {
            console.log("Downloading data from " + channel.name);
            let history = [];

            let nextCursor = true;
            let originalUrl = _self.getHistory(channel.id);
            let url = originalUrl;
            while (!!nextCursor) {
                console.log(url);
                const {
                    data: {messages, response_metadata},
                } = await axios.get(url);
                if (messages) {
                    history.push(messages);
                }
                if (response_metadata && response_metadata.next_cursor) {
                    url = _self.next(response_metadata.next_cursor, originalUrl);
                } else {
                    nextCursor = false;
                }
            }

            await _self.saveFile(channel.name, JSON.stringify(history));
            resolve();
        });
    }
}
