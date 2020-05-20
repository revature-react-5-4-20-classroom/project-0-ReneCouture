
import {Request,Response,NextFunction}from'express'

export function authAdminMiddleware(rq:Request,rs:Response,next:NextFunction){
    //console.log(`authAdminMiddleware() is commented out`)
    
    console.log(`authAdminMiddleware() has taken a look`)
    if(!rq.session)
    {
        rs.status(401).send(`authAdminMiddleware(). No session`)
    }
    else if(!rq.session.user)
    {
        rs.status(402).send(`authAdminMiddleware(). No session.user`)
    }
    // else if(rq.session.user.role!=='Admin')
    // {
    //     rs.status(403).send(`authAdminMiddleware(). You are not authorized`)
    // }

    next()
}

//allow GET requests from anyone. let POST requests in if the user is logged in
//export const authReadOnlyMiddleware=(rq:Request,rs:Response,next:NextFunction)=>{
export function authReadOnlyMiddleware(rq:Request,rs:Response,next:NextFunction)
{
    console.log(`authReadOnlyMiddleware() has taken a look`)

    if(rq.method==='GET'){//this could maybe refactored to an endpoint style. app.get()
        next()
    }else if(!rq.session||!rq.session.user){
        rs.status(401).send(`authReadOnlyMiddleware(). ${rq.method} unless you first login`)
    }else{
        next()
    }
}

//returns a function customized to autheticate all the roles
//authRoleFactory(['Admin','anotherRole'])
export async function authCheckLoggedInUser(rq:Request,rs:Response,allowedRoles:string[])
{
    console.log(`authCheckLoggedInUser() has taken a look`)

    if(!rq.session||!rq.session.user)
    {
        rs.send(`authCheckLoggedInUser() Please login`)
    }
    else
    {
        let currentUserRole=rq.session.user.role
        console.log(`currentUserRole ${currentUserRole}`)

        let allowedRole=allowedRoles.filter((allowedRole)=>{
            return allowedRole===currentUserRole
        })

        console.log(`allowedRole ${allowedRole}`)

        if(allowedRole.length===0){
            rs.status(403).send(`authCheckLoggedInUser() Role not authorized: ${currentUserRole}. Allowed Roles:${allowedRoles}`)
        }

        // let allowed=false
        // for(let allowedRole of allowedRoles)
        // {
        //     if(currentUserRole===allowedRole)
        //     {
        //         allowed=true
        //         break
        //     }
        // }

        // if(!allowed){
        //     rs.status(403).send(`authCheckLoggedInUser() Role not authorized: ${currentUserRole}. Allowed Roles:${allowedRoles}`)
        // }
    }
}