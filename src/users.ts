import {Core} from "./core";

export class UserHandler extends Core {
    private endpoint = "users.list?";
    userList = []
    constructor(token:string,dir:string){
        super(token,dir,'/users.json')
    }
    async getListOfUsers(){
        return this.getDataFile(this.getUsers)
    }
    getUsers = () => this.getPublic(this.endpoint);
    async getUserChannel(users:string[]):Promise<string[]>{
        return users.map(name=> this.dataList.get(name).id)
    }
}
