import {Core} from "./core";
import axios from 'axios'

export class Users extends Core {
    private endpoint = "users.list?";
    userList = []
    constructor(token:string,dir:string){
        super(token,dir)
        this.getListOfUsers()
    }
    async getListOfUsers(){
        return this.getAbstractList(this.getUsers,this.saveData)
    }
    private saveData = (members:any)=>{
        this.dataList=this.dataList.concat(members)
    }
    getUsers = () => this.getPublic(this.endpoint);
}
