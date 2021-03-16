# Ambiente local para simulação de DeadLock
Este projeto foi criado para motivos academicos para minha aprendizagem pessoal
em lambda function utilizado o [Node.js](https://nodejs.org/en/) e [Express](https://expressjs.com/pt-br/).

Feramentas Utilizadas:
* [NodeJs](https://nodejs.org/en/)
* [Express](https://expressjs.com/pt-br/)
* [knex](http://knexjs.org/)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [bodyParser](https://www.npmjs.com/package/body-parser)
* [cors](https://www.npmjs.com/package/cors)
* [nodemon](https://nodemon.io/)

## Screenshots
code view:
```ts
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
```

## Development

### Setup

#### 1) Instalação de dependencias
``` sh
npm i 
```
Obs: E necessario que o [NodeJs](https://nodejs.org/en/) já esteja instalado em sua máquina

#### 2) Data base
``` sh
docker-compose up -d 
```
Obs: Deixei uma aquivo de [DockerCompose](https://docs.docker.com/compose/) para que a utilização deste 
projeto seja mais simples

#### 3) Migrate Knex
``` sh
npm run migrate:up
```

#### 4) Iniciar Projeto
``` sh
npm run dev

# verificar a url http://localhost:8080 ou http://localhost:${customPort}
```

#### 5) Uso
Faça 2 request na rota http://localhost:8080 ou http://localhost:${customPort} e verifique o seu 
console de execução

## Extra
Estarei deixando uma arquivo chamdo `./DeadLock.jmx` para ser utilizado no [jmeter](https://jmeter.apache.org/)
para testes de carga.

## Contato

Desenvolvido por: [Ismael Alves](https://github.com/ismaelalvesgit)

* Email: [cearaismael1997@gmail.com](mailto:cearaismael1997@gmail.com) 
* Github: [github.com/ismaelalvesgit](https://github.com/ismaelalvesgit)
* Linkedin: [linkedin.com/in/ismael-alves-6945531a0/](https://www.linkedin.com/in/ismael-alves-6945531a0/)

### Customização de Configurações do projeto
Verifique [Configurações e Referencias](https://expressjs.com/pt-br/).