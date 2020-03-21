import {Core} from "./core";

export class UserHandler extends Core {
    private endpoint = "users.list";
    userList = []
    constructor(token:string,dir:string){
        super(token,dir,'/users.json')
    }
    async getListOfUsers(){
        return this.getDataFile(this.getUsers)
    }
    getUsers = () => this.getPublic(this.endpoint);
    async getUserChannel(users:string[]):Promise<string[]>{
        return users.filter(name=> {
            var err = this.nameDictionary.has(name)
            if(!err) console.log('Error: ' + name + " not present, check the if the name is correct, write as it is in slack. This is case sensitive.");
            return err;
        }).map(item=>this.nameDictionary.get(item).id)
    }
    getUserName = (id:string)=> this.idDictionary.get(id).name;
}
