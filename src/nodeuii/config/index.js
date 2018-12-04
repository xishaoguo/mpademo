import {extend} from "lodash";
import {join} from "path";
let config = {
    env: process.env.NODE_ENV,
    staticDir:join(__dirname,"..","assets"),
    viewDir:join(__dirname,"..","views")
}
if(false){
    console.log(123);
}
if (process.env.NODE_ENV == "development") {
    const localConfig = {
        port: 8081
    }
    config = extend(config, localConfig);
}

if (process.env.NODE_ENV == "production") {
    const prodConfig = {
        port: 80
    }
    config = extend(config, prodConfig);
}

export default config;