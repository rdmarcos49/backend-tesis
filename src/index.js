const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const createToken = require('./config/createToken')
const validateToken = require('./api/middlewares/validateToken')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

const users = [
  {
    id: 1,
    name: 'rober',
    lastname: 'marcos',
    username: 'roberto123',
    password: 'roberto123',
    role: 'technical',
    avatar: null
  },
  {
    id: 5,
    name: 'Roberto',
    lastname: 'Marcos',
    username: 'roberto124',
    password: 'roberto124',
    role: 'technical',
    avatar: null
  }
]

app.post('/login', (request, response) => {
  const { username, password } = request.body
  const user = users.find(localUser => localUser.username === username)
  const jwt = user ? createToken(user) : null

  return (user && user.password === password)
    ? response.status(202).json({ jwt })
    : response.status(400).json('Response from login!')
})

app.post('/signin', (request, response) => {
  const {
    name,
    lastname,
    username,
    password,
    // avatar,
    role
  } = request.body
  const user = users.find(localUser => localUser.username === username)
  if (user) {
    return response.status(409).json({ error: 'The user already exists' })
  }
  const ids = users.map(user => user.id)
  const id = ids.length ? Math.max(...ids) : 1
  const userData = { id, name, lastname, username, password, avatar: null, role }
  users.push(userData)
  return response.status(201).end()
})

app.post('/patients', validateToken, (request, response) => {
  response.json('Response from patients!')
})

app.get('/patients/:dni', validateToken, (request, response) => {
  response.json('Response from patients/:dni!')
})

app.use((request, response) => {
  response.status(404).end()
})

const PORT = 3030

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
