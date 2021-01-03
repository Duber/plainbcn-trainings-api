import fetch from 'node-fetch'
import cache from 'memory-cache'

const SKILLS_CACHE_KEY = 'skills'
const SKILLS_CACHE_DURATION = 300000

class SkillService {
    async getAll() {
        const airtable_skill_url = `https://api.airtable.com/v0/appIJ1OyA5ly2fcib/Skills?api_key=${process.env.AIRTABLE_KEY}`
        let skills = cache.get(SKILLS_CACHE_KEY)
        if (!skills) {
            skills = await fetch(airtable_skill_url).then((result) => result.json())
            skills = skills.records.map((record) => {
                return {
                    id: record.id,
                    area: record.fields.Area,
                    level: record.fields.Level,
                    title: record.fields.Name,
                    people: 'Name (from People)' in record.fields ? record.fields['Name (from People)'] : []
                }
            })
            cache.put(SKILLS_CACHE_KEY, skills, SKILLS_CACHE_DURATION)
        }
        return skills
    }
}
export const skillService = new SkillService()