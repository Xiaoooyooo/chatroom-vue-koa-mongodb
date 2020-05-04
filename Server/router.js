const Router = require('koa-router')

const router = new Router

const signin = require('./routes/signin')
const datainit = require('./routes/data')
const signup = require('./routes/signup')

router.use('/signin',signin.routes(),signin.allowedMethods())
router.use('/datainit',datainit.routes(), datainit.allowedMethods())
router.use('/signup',signup.routes(),signup.allowedMethods())
module.exports = router