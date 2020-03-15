import axios from "axios";
import fs from "fs";
import {Core} from "./core";

export class ChannelFactory extends Core {
    private endpoint = "users.conversations";
    private conversations = "conversations.history";
    constructor(token: string, dir: string) {
        super(token, dir, "/channels.json");
    }
    async getData(channels: string[]) {
        await this.loadChannels();
        if (channels) this.getChannelsHistory(channels);
    }
    private async loadChannels() {
        return this.getDataFile(this.getChannels);
    }
    public async getChannelsHistory(channels: string[]) {
        channels.forEach((item) => {
            if (this.dataList.has(item)) {
                const channelInfo = this.dataList.get(item);
                this.getHistoryData(channelInfo);
            } else {
                console.log("channel with name " + item + " does not exists");
            }
        });
    }
    private getChannels = () => this.getPublic(this.endpoint) + "&types=private_channel,public_channel,im,mpim";

    private getHistory = (channelName: string) => this.SLACK_URL + this.conversations + "?token=" + this.TOKEN + "&channel=" + channelName;

    getChannelsName = (list: {data: {channels: any[]}}) =>
        list.data.channels.map((item: {name: string; id: string}) => {
            return {name: item.name, id: item.id};
        });

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
            if (response_metadata && response_metadata.next_cursor) {
                url = this.next(response_metadata.next_cursor, originalUrl);
            } else {
                nextCursor = false;
            }
        }

        if (history.length > 0) {
            await this.saveFile(channel.name, JSON.stringify(history));
        }
    };
}
