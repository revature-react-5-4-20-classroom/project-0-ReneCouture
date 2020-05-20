
import{Role}from'./Role';

export class User{
    id:         number // primary key
    username:   string // not null unique
    password:   string // not null
    firstName:  string // not null
    lastName:   string // not null
    email:      string // not null
    role:       Role // not null

    constructor(
        id:         number,
        username:   string,
        password:   string,
        firstName:  string,
        lastName:   string,
        email:      string,
        roleId:     number,
        roleName:   string
    ){
        this.id=id
        this.username=username
        this.password=password
        this.firstName=firstName
        this.lastName=lastName
        this.email=email
        this.role={id:roleId,role:roleName}
    }
}









