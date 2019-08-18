const mongoose = require('../database');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//função do mongoose que é executada antes de 
UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10)/*Número de round que será encriptado */
  this.password = hash;
  next();
})

const User = mongoose.model('User', UserSchema)

module.exports = User;