/**
 * IndexModel模块
 * @author 190598130@qq.com
 */


 /**
  * IndexModel类，生成一段异步的数据
  * @class
  */
 export default class IndexModel{
    /**
     * @constructor
     * @param {sting} app koa2的上下文环境
     */
    constructor(app){
        this.app = app;
    }
    /**
     * 获取具体的api的接口数据
     * @return {Promise} 返回的异步处理结果
     * @example
     * return new Promise
     * getData()
     */
    getData(){
        return new Promise((resolve,reiect)=>{
            setTimeout(()=>{
                resolve("大家好才是真的好");
            },1000);
        });
    }
 }