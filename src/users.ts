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
        let nextCursor = true;
        console.log('Getting List of Users,Please Wait');

        let originalUrl = this.getPublic(this.endpoint);
        let url = originalUrl;
        while (!!nextCursor) {
            const {
                data: {members, response_metadata},
            } = await axios.get(url);
            this.userList = this.userList.concat(members)

            nextCursor = response_metadata ? !!response_metadata.next_cursor : false;

            url = this.next(response_metadata.next_cursor, originalUrl);
        }
    }
}
