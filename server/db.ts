/* eslint-disable no-console */
import mongoose from 'mongoose'

const uri = 'mongodb+srv://antrioe:cc995801@cluster0.vpoxgon.mongodb.net/e-chat?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(uri).then((res) => {
  console.log(`db connected ${res.version}`)
}).catch((err) => {
  console.log(`db error${err}`)
})
