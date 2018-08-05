/**
 *
 * 阿里云短信发送接口 nodejs 版本
 * 阿里云短信API官方文档: https://help.aliyun.com/document_detail/44364.html?spm=5176.8195934.507901.11.pLzahV
 */

const request = require('request')
const crypto = require('crypto')




class AliyunSms {
    private config: any
    constructor(conf) {
        this.config = {
            AccessKeyId: conf.AccessKeyId, // 阿里短信服务所用的密钥
            AccessKeySecret: conf.AccessKeySecret,         // 阿里短信服务所用的密钥值
            Format: 'JSON',
            SignatureMethod: 'HMAC-SHA1',
            SignatureVersion: '1.0',
            SignatureNonce: '' + Math.random(),
            Timestamp: new Date().toISOString(),
            Action: 'SendSms',
            Version: '2017-05-25',
            RegionId: 'cn-hangzhou'
        }
    }

    /**
  * 阿里云短信发送接口
  * @param data  发送短信的参数，参考：最后sendRegistSms示例
  * @param callback 发送短信后的回调函数
  */
    _sendMessage(data) {
        
        var param = Object.assign(data, this.config)
        delete param.AccessKeySecret
        param.Signature = this._signParameters(param, this.config.AccessKeySecret)
        return new Promise((resolve, reject) => {
            request.post({
                url: 'http://dysmsapi.aliyuncs.com/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                form: param
            }, function (err, response, body) {
                console.log('response',response)
                if (response.statusCode === 201 || response.statusCode === 200) {
                    if(JSON.parse(body).Code === 'OK') {
                        resolve(JSON.parse(body))
                    }else {
                        reject(JSON.parse(body))
                    }
                } else {
                    reject(JSON.parse(err))
                }
            })
        })
    }

    /**
     * 短信接口签名算法函数
     * @param param 发送短信的参数
     * @param AccessKeySecret 阿里短信服务所用的密钥值
     */
    _signParameters(param, AccessKeySecret) {
        var param2 = {}
        var data: any = []

        var oa = Object.keys(param).sort()

        for (var i = 0; i < oa.length; i++) {
            var key = oa[i]
            param2[key] = param[key]
        }

        for (var key in param2) {
            data.push(encodeURIComponent(key) + '=' + encodeURIComponent(param2[key]))
        }

        data = data.join('&')
        var StringToSign = 'POST' + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(data)
        AccessKeySecret = AccessKeySecret + '&'
        return crypto.createHmac('sha1', AccessKeySecret).update(Buffer.from(StringToSign, 'utf-8')).digest('base64')
    }

    // 发送注册短信[业务级]
    sendRegistSms(obj) {
        // var data = {
        //   PhoneNumbers: '18575740461', // 要发送到短信的手机
        //   SignName: '悦夜NightPlus', // 短信签名，阿里云短信平台申请
        //   TemplateCode: 'SMS_76555069', // 短信模板Code，阿里云短信平台申请
        //   TemplateParam: '{"name":"徐晨"}', // 短信模板中参数指定，以你的为准替换之
        //   OutId: '1234'// 可选
        // }
        return this._sendMessage(obj)
    }
    // 发送用户修改密码短信[业务级]
    sendChangePwdSms() {

    }
}

export { AliyunSms }

/*
var AliyunSms = function (conf) {

  this.config = {
    AccessKeyId: conf.AccessKeyId, // 阿里短信服务所用的密钥
    AccessKeySecret: conf.AccessKeySecret,         // 阿里短信服务所用的密钥值
    Format: 'JSON',
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: '' + Math.random(),
    Timestamp: new Date().toISOString(),
    Action: 'SendSms',
    Version: '2017-05-25',
    RegionId: 'cn-hangzhou'
  }
}

AliyunSms.prototype = {

}

*/



