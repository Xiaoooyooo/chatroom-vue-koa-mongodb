const Router = require('koa-router')
const datainit = new Router
const { GetData } = require('../db')

datainit.get('/', async (ctx, next) => {
  ctx.body = await GetData()
})

module.exports = datainit