import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { getKeysUrl } from './openid-tools.js'
import { skillService } from './skill/skill-service.js'
import { freeTrackService } from './freetrack/freetrack-service.js'
import { peopleService } from './people/people-service.js'
import UserSkillMapper from './skill/user-skill-mapper.js'
import FreeTrackMapper from './freetrack/freetrack-mapper.js'
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

server.get('/api/skill', async (req, res) => {
    const skills = await skillService.getAll()
    let userSkills = new UserSkillMapper().Map(skills, req.user.preferred_username)
    res.json(userSkills)
})

server.get('/api/freetrack', async (req, res) => {
    let freetrack = await freeTrackService.getAll()
    freetrack = new FreeTrackMapper().Map(freetrack, req.user.preferred_username)
    res.json(freetrack)
})

server.post('/api/freetrack/like', async (req, res) => {
    const id = req.body.id
    const freeTrackRecord = await freeTrackService.get(id)
    const likes = freeTrackRecord.fields.Likes ?? []
    const user = await peopleService.get(req.user.preferred_username)
    const updatedLikes = likes.filter(i => i != user.id).concat([user.id])
    await freeTrackService.updateLikes(id, updatedLikes)
})

server.post('/api/freetrack/unlike', async (req, res) => {
    const id = req.body.id
    const freeTrackRecord = await freeTrackService.get(id)
    const user = await peopleService.get(req.user.preferred_username)
    const likes = freeTrackRecord.fields.Likes ?? []
    const updatedLikes = likes.filter(i => i != user.id)
    await freeTrackService.updateLikes(id, updatedLikes)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})