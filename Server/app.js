const wsServer = require('./ws')

const Koa = require('koa')

const app = new Koa

const router = require('./router')

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*")
  await next()
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(8888)