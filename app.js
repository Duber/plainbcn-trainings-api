const express = require('express')
const app = express()
const port = 3001

const data = [
    {
      area: 'backend',
      level: 'basic',
      title: 'backend 101',
      accomplished: 'true'
    },
    {
      area: 'frontend',
      level: 'basic',
      title: 'frontend 101',
      accomplished: 'false'
    }
  ]

  app.get('/', (req, res) => {
    res.send()
})

app.get('/api/skills', (req, res) => {
    res.json(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})