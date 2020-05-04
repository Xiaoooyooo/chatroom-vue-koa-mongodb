const MongoClient = require('mongodb').MongoClient
const { mongoUrl } = require('./config')
function connectMongo(callback) {
  return function (data, callback1) {
    if (callback1 instanceof Function === false)
      throw new TypeError('Argument must be a function')
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, database) => {
      if (err) throw err
      // console.log('Success')
      if (callback instanceof Function === false)
        throw new TypeError(`Argument must be a function`)
      callback(database, data, callback1)
    })
  }
}

function insert(database, data, callback) {
  database.db('chatroom').collection('messages').insertOne(data, (err, res) => {
    if (err) {
      callback(err)
    } else {
      // console.log("Success:\n", data)
      callback(null, res)
    }
    database.close()
  })
}

function find(database, query = {}, callback) {
  database.db('chatroom').collection('messages')
    .find(query, { projections: { _id: 0 } })
    .toArray((err, data) => {
      if (err)
        callback(err)
      else
        callback(null, data)
      database.close()
    })
}

function getData() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, database) => {
      if (err)
        reject("连接数据库出错")
      else {
        database.db('chatroom').collection('messages')
          .find({}, {}).sort({ key: -1 }).limit(20)
          .toArray((err, res) => {
            if (err)
              reject("数据库内部出错")
            else {
              resolve(res)
            }
            database.close()
          })
      }
    })
  }).then(res => res).catch(err => err)
}

function signin(user) {
  user = JSON.parse(user)
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, database) => {
      if (err) reject(err)
      console.log(user)
      database.db('chatroom').collection('userinfo').findOne({ username: user.username }, (err, res) => {
        if (err) reject(err)
        if (!res) {
          reject({
            status: false
          })
          return
        }
        if (user.passwd === res.password)
          resolve({
            user: user.username,
            status: true
          })
        else
          reject({
            status: false
          })
        database.close()
      })
    })
  }).then(res => res).catch(err => err)
}

function signup(user) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, database) => {
      if (err) reject(err)
      database.db('chatroom').collection('userinfo').insertOne(user, (err, res) => {
        if (err) reject(err)
        resolve({
          user: user.username,
          status: true
        })
        database.close()
      })
    })
  }).then(res => res).catch(err => err)
}

function username_check(name) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, database) => {
      if (err) throw err
      database.db('chatroom').collection('userinfo').findOne({ username: name }, (err, res) => {
        if (err) throw err
        if (res) reject(false)
        else resolve(true)
        // database.close()
      })
    })
  }).then(res => res).catch(err => err)
}

module.exports = {
  mongoInsert: connectMongo(insert),
  mongoFind: connectMongo(find),
  GetData: getData,
  Signin: signin,
  Signup: signup,
  Username_check: username_check
}