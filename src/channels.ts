import axios from "axios";
import {Core} from "./core";

export class ChannelsManager extends Core {
    private endpoint = "users.conversations";
    private conversations = "conversations.history";

    constructor(token: string, dir: string) {
        super(token, dir, "/channels.json");
    }
    async loadChannels() {
        return this.getDataFile(this.getChannels);
    }
    public async getChannelsHistory(channels: string[],getUserName:(id:string)=>string) {
        var names = channels.filter((id) => {
            var isPresent = this.nameDictionary.has(id);
            // if (!isPresent) console.log("channel does not exists");
            return isPresent;
        });
        var calls = names.map(async (item) => {
            const channelInfo = this.nameDictionary.get(item);
            return await this.getHistoryData(channelInfo,getUserName);
        });
        return Promise.all(calls);
    }
    getChannels= () => this.getPublic(this.endpoint) + "&types=private_channel,public_channel,mpim,im";
    
    private getHistory(channelName: string) {
        return this.SLACK_URL + this.conversations + "?token=" + this.token +"&channel=" + channelName;
    }

    getChannelsName(list: {data: {channels: any[]}}) {
        return list.data.channels.map((item: {name: string; id: string}) => {
            return {name: item.name, id: item.id};
        });
    }

    async getHistoryData(channel: {name: string; id: string,user:string},getUserName:(id:string)=>string) {
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

            await _self.saveFile(channel.name|| getUserName(channel.user), JSON.stringify(history));
            resolve();
        });
    }
}
