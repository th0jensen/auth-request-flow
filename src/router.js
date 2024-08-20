const express = require('express')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const router = express.Router()

const mockUser = {
    username: 'authguy',
    password: 'mypassword',
    profile: {
        firstName: 'Chris',
        lastName: 'Wolstenholme',
        age: 43,
    },
}

router.post('/login', (req, res) => {
    const { username, password } = req.body

    const user =
        (username === mockUser.username ?? password === mockUser.password)
            ? mockUser
            : null

    if (user === null) {
        return res.status(400).json({ error: 'Incorrect username or password' })
    }

    const token = jwt.sign({ id: user.username }, secret)
    return res.status(200).json({ token: token })
})

router.get('/profile', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, secret)
    const user = decoded.username === mockUser.username ? mockUser : null

    if (user === null) {
        res.status(401).json({ error: 'Invalid authorization token' })
    }

    const profile = user.profile
    res.status(200).json({ profile: profile })
})

module.exports = router
