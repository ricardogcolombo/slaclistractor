import axios from "axios";
import {Core} from "./core";
import {UserHandler} from "./users";
import {ChannelsManager} from "./channels";

export class MessageExtractor extends Core {
    private _userManager: UserHandler;
    private _channelManager: ChannelsManager;

    constructor(token: string, dir: string) {
        super(token, dir);
        this._userManager = new UserHandler(token, this.dir);
        this._channelManager = new ChannelsManager(token, this.dir);
    }

    async getData(channels: string[], users: string[]) {
        await this._channelManager.loadChannels();
        await this._userManager.getListOfUsers();
        if (channels) await this._channelManager.getChannelsHistory(channels);
    }
}
