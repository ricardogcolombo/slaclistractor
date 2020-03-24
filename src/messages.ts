import {Core} from "./core";
import {UserHandler} from "./users";
import {ChannelsManager} from "./channels";

export class MessageExtractor extends Core {
    private _userManager: UserHandler|undefined;
    private _channelManager: ChannelsManager| undefined;

    constructor(token: string, dir: string) {
        super(token, dir);
    }

    async getData(channels: string[], users: string[],groups:string[]) {
        this._userManager = new UserHandler(this.token,this.dir)
        await this._userManager.getListOfUsers()
        
        this._channelManager= new ChannelsManager(this.token,this.dir);
        await this._channelManager.loadChannels();
        var cList = this._channelManager.getChannelsId(channels);
        var gms = this._channelManager.getGroups(groups)

        var usersId= await this._userManager.getUserChannel(users);
        var dms = this._channelManager.getUsersChannel(usersId)
        let messageList = cList.concat(dms).concat(gms)
        if (messageList) await this._channelManager.getChannelsHistory(messageList,this._userManager.getUserName);
    }
}
