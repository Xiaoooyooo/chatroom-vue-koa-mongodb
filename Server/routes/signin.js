const Router = require('koa-router')

const signin = new Router

signin.get('/', async (ctx, next) => {
  ctx.body = {
    message: 'OK'
  }
})

const { Signin } = require('../db')
signin.post('/', async (ctx,next) => {
  // console.log(ctx.req)
  await new Promise(resolve => {
    let postdata = ''
    ctx.req.addListener('data', (data) => {
      postdata += data
    })
    ctx.req.addListener('end', () => {
      // console.log(postdata)
      resolve(postdata)
    })
  }).then(async res => {
    ctx.body = await Signin(res)
  })
})

module.exports = signin