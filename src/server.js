import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { getKeysUrl } from './openid-tools.js'
import { skillService } from './skill/skill-service.js'
import { freeTrackService } from './freetrack/freetrack-service.js'
import { peopleService } from './people/people-service.js'
import appInsights from 'applicationinsights'
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import bodyParser from 'body-parser'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

appInsights.setup().start()
const server = express()
const port = process.env.PORT || 3001

server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))


server.get('/', (req, res) => {
    res.send()
})

const keysUrl = await getKeysUrl(process.env.TOKEN_ISSUER)
server.use(jwt({
    secret: jwksRsa.expressJwtSecret({
        jwksUri: keysUrl
    }),
    issuer: process.env.TOKEN_ISSUER,
    algorithms: ['RS256']
}))

server.get('/api/user/me', async (req, res) => {
    const user = await peopleService.getOrCreate(req.user.preferred_username)
    res.json(user)
})

server.patch('/api/user/me', async (req, res) => {
    const data = req.body
    const user = await peopleService.get(req.user.preferred_username)
    await peopleService.patch(user.id, data)
    res.send()
})

server.get('/api/skill', async (req, res) => {
    const skills = await skillService.getAll()
    res.json(skills)
})

server.get('/api/skill/:id', async (req, res) => {
    const skill = await skillService.get(req.params.id)
    res.json(skill)
})

server.get('/api/freetrack', async (req, res) => {
    let freetrack = await freeTrackService.getAll()
    res.json(freetrack)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})