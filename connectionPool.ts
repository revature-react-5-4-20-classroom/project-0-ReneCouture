import{Pool, PoolClient, QueryResult}from 'pg'
import { User } from './models/User';
import { Row } from './databaseFake';

export const connectionPool:Pool=new Pool({
    host:       process.env['PG_HOST'],
    user:       process.env['PG_USER'],
    password:   process.env['PG_PASSWORD'],
    database:   process.env['PG_DATABASE'],
    port:       5432,
    max:        2
});

export async function performQuery(query:string,queryParams?):Promise<Row[]>
{
    console.log(`performQuery() has taken a look`)
    let client:PoolClient=await connectionPool.connect()

    try
    {
        let result:QueryResult=await client.query(query,queryParams);

        //console.log(result)
        console.log(result.rows)
        return result.rows

        // let rowsOnly:Row[]=[]
        // console.log(`   looking at row in results array`);

        // for(let r of result.rows)
        // {
        //     console.log(`   ${r}`);
        //     rowsOnly.push(r);
        // }

        // return rowsOnly

        //return result.rows//rows is an array
        //rs.status(200).json(result.rows)
    }
    catch(e)
    {
        throw new Error(`   ${e.message}`)
    }
    finally
    {
        console.log(`   finally releases client`);
        client && client.release()
    }

    //rs.json(users)
}