const express = require('express')
const User = require('../models/user')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

function genereteToken(params = {}) {
  return jwt.sign({ params }, authConfig.secret, {
    /**Milesegundos */
    expiresIn: 86400
  })

}
/*
*Rota de registro do usuario
*/
router.post('/register', async (req, res) => {

  const { email } = req.body;
  
  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'Este usuário já existe.' })

    const user = await User.create(req.body)
    user.password = undefined;

    return res.send({
      user,
      token: genereteToken({ id: user.id })
    })

  } catch (error) {
    return res.status(400).send({ error: 'Registro falhou' })
  }

})

router.post('/authenticate', async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password')

  if (!user)
    return res.status(400).send({ error: 'Usuário não encontrado' })

  if (!await bcrypt.compare(password, user.password))
    return res.status(400).send({ error: 'Senha incorreta.' })

  user.password = undefined;

  return res.send({
    user,
    token: genereteToken({ id: user.id })
  })

})

module.exports = app => app.use('/auth', router)