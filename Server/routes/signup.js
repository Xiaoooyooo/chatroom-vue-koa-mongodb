const Router = require('koa-router')

const signup = new Router

const { Signup, Username_check } = require('../db')

signup.post('/', async (ctx, next) => {
  await new Promise((resolve, reject) => {
    let postdata = ''
    ctx.req.addListener('data', (data) => {
      postdata += data
    })
    ctx.req.addListener('end', () => {
      resolve(JSON.parse(postdata))
    })
  }).then(async res => {
    // console.log(res)
    ctx.body = await Signup(res)
    // ctx.body = 'OK'
  }).catch(err => {
    console.log(err)
  })
})

signup.get('/',async (ctx, next) => {
  ctx.body = await Username_check(ctx.query.username)
})

module.exports = signup