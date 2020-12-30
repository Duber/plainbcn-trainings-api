if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express')
const fetch = require("node-fetch");

const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send()
})

app.get('/api/skills', async (req, res) => {
    const url = `https://api.airtable.com/v0/appIJ1OyA5ly2fcib/Skills?api_key=${process.env.AIRTABLE_KEY}`
    let data = await fetch(url).then((result) => result.json())
    data = data.records.map((record)=>{
        return {
            id: record.id,
            area: record.fields.Area,
            level: record.fields.Level,
            title: record.fields.Name,
            accomplished: false
        }
    })
    res.json(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
