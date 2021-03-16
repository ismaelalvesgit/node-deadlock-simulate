/**
 * @Author Ismael Alves <cearaismael1997@gmail.com>
 * @lastUpdate  16/03/2021
 */
import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import Chance from 'chance';
import cluster from 'cluster';
import { cpus } from 'os';
const knexfile = require('./knexfile');
const database = knex(knexfile);
const chance = new Chance();
const treads = cpus();
const app = express();
const port = process.env.SERVER_PORT || 8080;
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res)=>{
    database.transaction((trx)=>{
        database.from('test')
        .transacting(trx)
        .first()
        .then((get)=>{
            if(get){
                database.from('test')
                .transacting(trx)
                .where('id', get.id)
                .forUpdate()
                .update({
                    value: chance.string()
                }).then(()=>{
                    trx.commit
                    res.json(get)
                }).catch((err)=> {
                    console.log("ERRO - QUERY", JSON.stringify(err))
                    res.json({err: err.code})
                })
            }else{
                database.from('test')
                .transacting(trx)
                .insert({
                    value: chance.string()
                }).then((raw)=>{
                    database.from('test')
                    .transacting(trx)
                    .where('id', raw[0])
                    .forUpdate()
                    .update({
                        value: chance.string()
                    }).then(()=>{
                        trx.commit
                        res.json(raw[0])
                    }).catch((err)=> {
                        console.log("ERRO - QUERY", JSON.stringify(err))
                        res.json({err: err.code})
                    })
                })
            }
        })
    })
})

if(cluster.isMaster){
    treads.forEach(() => cluster.fork())
    cluster.on('exit', ()=>{
        cluster.fork()
    })
}else{
    app.listen(port, ()=>{
        console.log(`Server on http://localhost:${port}`)
    });
}