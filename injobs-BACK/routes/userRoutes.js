const express = require('express')
const {signupUser, loginUser, getUser, putUser} = require('../controllers/userController')

const router = express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/users', getUser)
router.put('/putUser', putUser)
router.get('/users/:userId', getUser); // Rota para obter dados do usuário

module.exports = router