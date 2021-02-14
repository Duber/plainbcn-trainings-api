import fetch from 'node-fetch'
import cache from 'memory-cache'
import SkillMapper from './skill-mapper.js'
import SkillFilter from './skill-filter.js'

const CACHE_KEY = 'skills'
const CACHE_DURATION = 300000

class SkillService {
    async getAll() {
        const url = `${process.env.AIRTABLE_SKILLS_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            data = data.records.map(SkillMapper.Map)
            data = data.filter(SkillFilter.Filter)
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async get(id) {
        const skills = await this.getAll()
        const skill =  skills.find(s => s.id === id)
        return skill
    }
}
export const skillService = new SkillService()