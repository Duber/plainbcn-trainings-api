import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import auth from './auth.js'
import { skillService } from './skill-service.js'
import UserSkillMapper from './user-skill-mapper.js'

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
    const skills = await skillService.getAll()
    let userSkills = new UserSkillMapper().Map(skills, req.user.email)
    res.json(userSkills)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
