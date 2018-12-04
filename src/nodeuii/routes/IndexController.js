import {
    route,
    GET,
    POST
} from "awilix-koa";
@route("/")
@route("/index.html")
class IndexController {
    constructor({
        indexService
    }){
        this.indexService = indexService;
    }
    @GET()
    async indexAction(ctx,next){
        const result = await this.indexService.getData();
        ctx.body = { result };
        // const result = await this.indexService.getData();
        // ctx.body = await ctx.render("index/pages/test.html",
        // {data:result});
    }
    async testAction(ctx,next){
            const result = await this.indexService.getData();
            ctx.body = await ctx.render("index/pages/test.html");
    }
}
export default IndexController;