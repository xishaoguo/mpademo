import Koa from "koa";
import config from "./config";
import errorHandler from './middwares/errorHandler';
import log4js from 'log4js';
import {createContainer,Lifetime} from "awilix";
import {loadControllers,scopePerRequest} from "awilix-koa";
import serve from "koa-static";
import render from "koa-swig";
import co from "co";

log4js.configure({
    appenders: { cheese: { type: 'file', filename: __dirname+'/logs/mylogs.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
});
const logger = log4js.getLogger('cheese');
const app = new Koa();
//创建IOC容器
const conttainer = createContainer();
//每一次请求
app.use(scopePerRequest(conttainer));
//装载所有的Service到容器里去
conttainer.loadModules([__dirname + '/services/*.js'], {
    formatName: "camelCase",
    resolverOptions: {
        lifetime: Lifetime.SCOPED
    }
});
app.context.render = co.wrap(render({
    root: config.viewDir,
    autoescape: true,
    cache: 'memory', // disable, set to false
    ext: 'html',
    writeBody: false
}));

errorHandler.error(app,logger);
app.use(loadControllers(__dirname+"/routes/*.js"));
app.use(serve(config.staticDir));
app.listen(config.port,()=>{
    console.log(`监听的端口是：${config.port}`);
});