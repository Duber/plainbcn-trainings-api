import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import { getKeysUrl } from './openid-tools.js'
import { skillService } from './skill-service.js'
import UserSkillMapper from './user-skill-mapper.js'
import appInsights from 'applicationinsights'
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

appInsights.setup().start()
const server = express()
const port = process.env.PORT || 3001

server.use(cors())

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

server.get('/api/skills', async (req, res) => {
    const skills = await skillService.getAll()
    let userSkills = new UserSkillMapper().Map(skills, req.user.preferred_username)
    res.json(userSkills)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})