/**
 * Filename: g:\project\airplake\mdc-v4\src\models\sms.ts
 * Path: g:\project\airplake\mdc-v4
 * Created Date: Tuesday, August 29th 2017, 12:13:27 pm
 * Author: Wy
 * 
 * Copyright (c) 2017 Your Company
 */


import bookshelf from '../lib/db'


const JPush = bookshelf.Model.extend({
    tableName: 'jpush'
})

export default JPush
