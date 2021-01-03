import cors from 'cors'
import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import auth from './auth.js'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const server = express()
const port = process.env.PORT || 3001

server.use(cors())

server.get('/', (req, res) => {
    res.send()
})

server.use(auth)

server.get('/api/skills', async (req, res) => {
    console.log("User info: ", req.user);
    const url = `https://api.airtable.com/v0/appIJ1OyA5ly2fcib/Skills?api_key=${process.env.AIRTABLE_KEY}`
    let data = await fetch(url).then((result) => result.json())
    data = data.records.map((record) => {
        return {
            id: record.id,
            area: record.fields.Area,
            level: record.fields.Level,
            title: record.fields.Name,
            accomplished: 'Name (from People)' in record.fields && record.fields['Name (from People)'].includes(req.user.email)
        }
    })
    res.json(data)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
