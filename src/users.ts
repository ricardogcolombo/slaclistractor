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
        return this.getDataFile(this.getUsers)
    }
    getUsers = () => this.getPublic(this.endpoint);
}
