/*
    This stops CORS. this should only be used when testing/developing

    This should not be used in a production server
*/

import {Request,Response, NextFunction}from'express'

export function corsFilter(rq:Request,rs:Response,next:NextFunction)
{
    rs.header('Access-Control-Allow-Origin',        `${rq.headers.origin}`)
    rs.header('Access-Control-Allow-Headers',       'Origin,Content-type,Accept')
    rs.header('Access-Control-Allow-Credentials',   'true')
    rs.header('Access-Control-Allow-Methods',       'GET,POST,PUT,PATH,PATCH,DELETE')

    if(rq.method==='OPTIONS')
    {
        rs.sendStatus(200)
    }
    else
    {
        next()
    }
}