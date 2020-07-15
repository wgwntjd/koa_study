const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');
const port = 4000;  

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log("jusung server is listening to port 4000");
});