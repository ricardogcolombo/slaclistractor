import {Core} from "./core";
import {UserHandler} from "./users";
import {ChannelsManager} from "./channels";

export class MessageExtractor extends Core {
    private _userManager: UserHandler|undefined;
    private _channelManager: ChannelsManager| undefined;

    constructor(token: string, dir: string) {
        super(token, dir);
    }

    async getData(channels: string[], users: string[]) {
        this._userManager = new UserHandler(this.token,this.dir)
        await this._userManager.getListOfUsers()

        this._channelManager= new ChannelsManager(this.token,this.dir);
        await this._channelManager.loadChannels();

        var dms = await this._userManager.getUserChannel(users);
        let messageList = channels.concat(dms)
        if (channels) await this._channelManager.getChannelsHistory(messageList);
    }
}
