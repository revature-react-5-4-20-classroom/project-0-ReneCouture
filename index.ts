import express      from 'express';
import bodyparser   from 'body-parser'
import { Request,Response,NextFunction } from "express";
let app=express();
//this is due wednesday may 20
function pl(text:string):void{console.log(text)}//shorter print line

import { corsFilter } from './middleware/corsFilter'
app.use(corsFilter)

app.use(bodyparser.json())

app.use(``,(rq:Request,rs:Response,next:NextFunction)=>{ //see what is happening
    pl("Request has come in")
    pl(rq.body)
    pl(``)
    next()
})

app.get(`/newEndpoint`,(rq:Request,rs:Response)=>{
    rs.send('webhooks are working I guess')
})

import{middlewareSession}from'./middleware/session'
app.use(middlewareSession) //use express sessions.

app.post(`/login`,async (req: Request, res: Response) => 
{
    console.log(`/login has taken a look`)
    const {username, password} = req.body;

    if( !username || !password) 
    {
        res.status(400).send('Please use a valid username and password to login');
    } 
    else 
    {
        try 
        {
            const rows:Row[]=await performQuery(
                `select*from tableUsers where username=$1 and password=$2;`,
                [username,password])

            console.log(`rows=${rows}`)

            if(rows.length<=0){
                res.send('Could not login. User not found')
            }

            const user=rows[0]
            console.log(`user=${user}`)

            if(req.session){
                req.session.user = user;
            }

            res.json(user);
        }
        catch(e)
        {
            console.log(e.message);
            res.status(401).send('Could not find username and password to login');
        }
    }
})

app.use(``,(rq:Request,rs:Response,next:NextFunction)=>{ //security
    pl("Security has taken a look")
    next()
})

import{authAdminMiddleware}from'./middleware/authorize'
app.use(authAdminMiddleware)

import {routerUsers} from './routerUsers'
app.use(`/users`,routerUsers)

import {routerReim} from './routerReim'
import { performQuery } from './connectionPool';
import { Row } from './databaseFake';
app.use(`/reimbursements`,routerReim)

app.get(``,(rq:Request,rs:Response)=>{//the last GET
    pl("the last GET '' has taken a look")
    rs.send(`<h1>Thank you for using the Expense Reimbursement System (ERS) API</h1><br />
               Please visit the following endpoints:<br />
               /login<br />
               /users<br />
               /users/:id<br />
               /reimbursements<br />
               /reimbursements/status/:id<br />
               /reimbursements/author/userId/:id`)
    pl(``)//newline to make it look nice
})

app.listen(3003,()=>{
    console.log(`Project 0 started. listening port 3003. Here we go!`)
})