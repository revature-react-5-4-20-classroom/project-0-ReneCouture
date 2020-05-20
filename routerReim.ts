
import express from 'express'

import {Request,Response,Router}from'express'
import { reimbursements, Row, rows } from './databaseFake'
import { Reimbursement } from './models/Reimbursement'
import { performQuery } from './connectionPool'
import { QueryResult } from 'pg'
import { authCheckLoggedInUser } from './middleware/authorize'
export const routerReim:Router=express.Router()

//find reimbursement by statusId
//accessd by 'finance-manager'
routerReim.get(`/status/:statusId`,async(rq:Request,rs:Response)=>{
    authCheckLoggedInUser(rq,rs,['finance-manager'])
    console.log(`GET /reimbursements/status/:statusId has taken a look`)
    
    try
    {
        let statusId=+rq.params.statusId//+explicit conversion to number
        console.log(`   statusId is ${statusId}`)
        const rows:Row[]=await performQuery('select*from tableReims WHERE status='+statusId+' order by dateSubmitted;')
        rs.json(rows);
    }
    catch(e)
    {
        console.log(`/reimbursements/status/:statusId ${e}`)
        rs.send('GET /reimbursements/status/:statusId could not perform query')
    }

    
    // let statusId=+rq.params.statusId
    // let arrayOfReimbursments=reimbursements.filter((reim:Reimbursement)=>{
    //     return(reim.status===statusId)
    // })
    // return rs.json(arrayOfReimbursments)
})

//find reimbursements by userId
//accessd by 'finance-manager'
routerReim.get(`/author/userId/:userId`,async(rq:Request,rs:Response)=>{
    authCheckLoggedInUser(rq,rs,['finance-manager'])
    console.log(`GET /author/userId/:userId has taken a look`)

    try
    {
        let userId=+rq.params.userId//+explicit conversion to number
        console.log(`   userId is ${userId}`)
        const rows:Row[]=await performQuery('select*from tableReims WHERE author='+userId+' order by dateSubmitted;')
        rs.json(rows);
    }
    catch(e)
    {
        console.log(`/author/userId/:userId ${e}`)
        rs.send('GET /author/userId/:userId could not perform query')
    }
})

//update reimbursement
//accessd by 'finance-manager'
routerReim.patch(``,async(rq:Request,rs:Response)=>{
    authCheckLoggedInUser(rq,rs,['finance-manager'])
    console.log(`PATCH /reimbursements has taken a look`)

    let reim=rq.body

    if(!reim.id){
        rs.send(`Cannot update reimbursement. reim id invalid. id=${reim.id}`);
    }

    if(reim.author){
        await performQuery(`update tableReims set author=$1 where id=$2;`, [reim.author,reim.id])
    }

    if(reim.amount){
        await performQuery(`update tableReims set amount=$1 where id=$2;`, [reim.amount,reim.id])
    }

    if(reim.dateSubmitted){
        await performQuery(`update tableReims set dateSubmitted=$1 where id=$2;`, [reim.dateSubmitted,reim.id])
    }

    if(reim.dateResolved){
        await performQuery(`update tableReims set dateResolved=$1 where id=$2;`, [reim.dateResolved,reim.id])
    }

    if(reim.description){
        await performQuery(`update tableReims set description=$1 where id=$2;`, [reim.description,reim.id])
    }

    if(reim.resolver){
        await performQuery(`update tableReims set resolver=$1 where id=$2;`, [reim.resolver,reim.id])
    }

    if(reim.status){
        await performQuery(`update tableReims set status=$1 where id=$2;`, [reim.status,reim.id])
    }

    if(reim.type){
        await performQuery(`update tableReims set type=$1 where id=$2;`, [reim.type,reim.id])
    }

    //find the reimbursement we just inserted
    const rows:Row[]=await performQuery('select*from tableReims WHERE id='+reim.id+';')
    rs.json(rows);
})

//submit reimbursement
//accessd by anyone
routerReim.post(``,async(rq:Request,rs:Response)=>{
    console.log(`POST /reimbursements has taken a look`)
    let reim=rq.body
    //console.log(`   reim.author=${reim.author}`)
    console.log(reim)

    if(!reim.author)        {sendInvalidEntry(rs,'Author')}
    if(!reim.amount)        {sendInvalidEntry(rs,'Amount')}
    if(!reim.dateSubmitted) {sendInvalidEntry(rs,'Date Submitted')}
    if(!reim.dateResolved)  {sendInvalidEntry(rs,'Date Resolved')}
    if(!reim.description)   {sendInvalidEntry(rs,'Description')}
    if(!reim.resolver)      {sendInvalidEntry(rs,'Resolver')}
    if(!reim.status)        {sendInvalidEntry(rs,'Status')}
    if(!reim.type)          {sendInvalidEntry(rs,'Type')}

    try
    {
        await performQuery(`insert into tableReims values (default,$1,$2,$3,$4,$5,$6,$7,$8);`,
        [   reim.author,        //1
            reim.amount,        //2
            reim.dateSubmitted, //3
            reim.dateResolved,  //4
            reim.description,   //5
            reim.resolver,      //6
            reim.status,        //7
            reim.type])         //8
    }
    catch(e)
    {
        console.log(e.message)
        rs.send(`POST /reimbursements could not insert new user`)
    }

    let id;//id of the last reimbursement which should be what we just inserted

    try
    {
        //find the reimbursement id we just inserted
        let rows:any[]=await performQuery('select max(id) from tableReims;')
        let row=rows[0]
        id=row['max']
        //console.log(`row=${row}`)
        //console.log(`id=${id}`)
    }
    catch(e)
    {
        console.log(e.message)
        rs.send(`Query: could not select the highest id which is the last user added`)
    }

    try
    {
        //find the reimbursement we just inserted
        let rows:Row[]=await performQuery('select*from tableReims where id=$1;',[id])
        rs.json(rows);
    }
    catch(e)
    {
        console.log(e.message)
        rs.send(`Query: could not select the new user added`)
    }
})

function sendInvalidEntry(rs:Response,entryText:string)
{
    rs.send(`${entryText} is null. Please enter a value that is not null.`)
}
