/**
 * Filename: g:\project\airplake\mdc-v4\src\lib\db.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 12:10:50 pm
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */


const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '192.168.1.9',
        user: 'root',
        password: 'root',
        database: 'yedian-mdc',
        charset: 'utf8'
    }
})

const bookshelf = require('bookshelf')(knex)

export default bookshelf