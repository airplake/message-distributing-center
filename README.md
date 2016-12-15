# message-distributing-center
This project is designed for quick establish an message distributing center to handle huge amount of notification, verification messages that come from different services and functional component.


#目录说明

## 环境变量修改
* 首先执行： `cp .env.example .env`  
* 然后，`vim .env` 修改为自己的值  


##config配置说明     
* 配置文件说明    
    * default.js  
            > 该文件里配置的内容为默认配置，即无论开发环境如何，都会默认先读取该文件的配置信息  
    * development.js  
            > 该文件为开发环境配置  
    * production.js
            > 该文件为生产环境配置


            ##文件目录说明  
            * commom  
                所有的commom的js
            * config
                所有配置文件
            * log文件夹  
                存放log日志      
            * module文件夹  
                所有模块
            * test文件夹  
                unit test使用的文件夹，专门存放测试脚本


## run

    git clone https://github.com/airplake/message-distributing-center.git

    # install dependencies
    npm install

    # run for development with app
    npm start

    # run for production with app
    npm run serve


## run test

    npm install --global ava

    npm test                     
