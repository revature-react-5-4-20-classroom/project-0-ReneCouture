
import express, { NextFunction } from 'express'

import {Request,Response,Router}from'express'
import { users, Row } from './databaseFake'
import { User } from './models/User'
import { connectionPool, performQuery } from './connectionPool'
import { PoolClient, QueryResult } from 'pg'
import { authCheckLoggedInUser } from './middleware/authorize'
export const routerUsers:Router=express.Router()

//get all users
//allowed 'finance-manager'
routerUsers.get(`/`,async(rq: Request, rs: Response, next: NextFunction) => 
{
    //if(rq.session.user!=)
    authCheckLoggedInUser(rq,rs,['finance-manager'])
    console.log(`GET /users has taken a look`)
    
    try 
    {
        // get all users, using async/await
        const users : Row[] = await performQuery(`select*from tableUsers order by id;`);
        console.log(`/users has got all users`)
        rs.json(users);
        //res.send('hey there')
        //res.sendStatus(200)
        console.log(`/users sent a response`)
    }
    catch(e) 
    {
        console.log(`/users Error ${e}`)
        //console.log(`/users will now call next()`)
        //next(e);
        //console.log(`/users has called next()`)
        rs.send('GET /users could not perform query')
    }
})

//accessed by finance-manager
routerUsers.get(`/:id`,async(rq:Request,rs:Response)=>{//find user by id.
    authCheckLoggedInUser(rq,rs,['finance-manager'])
    console.log(`GET /users/:id has taken a look`)

    try{
        let id=+rq.params.id//+explicit conversion to number
        console.log(`   id is ${id}`)
        const rows:Row[]=await performQuery('select*from tableUsers WHERE id=$1 order by id;',[id])
        rs.json(rows);
    }
    catch(e)
    {
        console.log(`/users/:id Error ${e}`)
        rs.send('GET /users/:id could not perform query')
    }
})

//user update any possible fields given
//the body of the request must contain a json object representing the new user info
//accessd by 'admin'
routerUsers.patch(``,async(rq:Request,rs:Response)=>{
    console.log(`PATCH /users has taken a look`)
    authCheckLoggedInUser(rq,rs,['admin'])
    let user=rq.body

    if(!user.id){
        rs.send(`Cannot update user. user id invalid. id=${user.id}`);
    }

    if(user.username){
        await performQuery(`update tableUsers set username=$1 where id=$2;`, [user.username,user.id])
    }

    if(user.password){
        await performQuery(`update tableUsers set password=$1 where id=$2;`, [user.password,user.id])
    }

    if(user.firstName){
        await performQuery(`update tableUsers set firstName=$1 where id=$2;`,[user.firstName,user.id])
    }

    if(user.lastName){
        await performQuery(`update tableUsers set lastName=$1 where id=$2;`, [user.lastName,user.id])
    }

    if(user.email){
        await performQuery(`update tableUsers set email=$1 where id=$2;`,    [user.email,user.id])
    }

    //find the user we just inserted
    const rows:Row[]=await performQuery('select*from tableUsers WHERE id=$1;',[user.id])
    rs.json(rows);

    //update every field of the user
    // let ra:Row[]=await performQuery(`update tableUsers set username=$1 where id=$2;`, [user.username,user.id])
    // let rb:Row[]=await performQuery(`update tableUsers set password=$1 where id=$2;`, [user.password,user.id])
    // let rc:Row[]=await performQuery(`update tableUsers set firstName=$1 where id=$2;`,[user.firstName,user.id])
    // let rd:Row[]=await performQuery(`update tableUsers set lastName=$1 where id=$2;`, [user.lastName,user.id])
    // let re:Row[]=await performQuery(`update tableUsers set email=$1 where id=$2;`,    [user.email,user.id])

    // const validObject=new User(user.id,
    //     (user.username||null),
    //     (user.password||null),
    //     (user.firstName||null),
    //     (user.lastName||null),
    //     (user.email||null),
    //     user.role,
    //     ""
    // )
    // console.log(`   valid object is ${validObject}`)

    // {
    //     "username":user.username,
    // (user.password||null),
    // (user.firstName||null),
    // (user.lastName||null),
    // user.role};

    // let fields=[]
    // if(user.username)   {fields.push`username= '${user.username}'`}
    // if(user.password)   {fields+=`password='${user.password}'`}
    // if(user.firstName)  {fields+=`firstName='${user.firstName}'`}
    // if(user.lastName)   {fields+=`lastName='${user.lastName}'`}
    // if(user.role)       {fields+=`role='${user.role}'`}
    // rs.send(`   feilds=${fields}`)

    //update tableUsers set

    // try{
    //     let id=+rq.params.id//+explicit conversion to number
    //     console.log(`   id is ${id}`)
    //     const rows:Row[]=await performQuery('SELECT * FROM tableUsers WHERE tableUsers.id='+id+';')
    //     rs.json(rows);
    // }
    // catch(e)
    // {
    //     console.log(`/users/:id Error ${e}`)
    //     rs.send('GET /users/:id could not perform query')
    // }
})