import fetch from 'node-fetch'
import cache from 'memory-cache'

const SKILLS_CACHE_KEY = 'skills'
const SKILLS_CACHE_DURATION = 300000

class SkillService {
    async getAll() {
        const airtable_skill_url = `${process.env.AIRTABLE_SKILLS_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let skills = cache.get(SKILLS_CACHE_KEY)
        if (!skills) {
            skills = await fetch(airtable_skill_url).then((result) => result.json())
            skills = skills.records.map((record) => {
                return {
                    id: record.id,
                    area: record.fields.Area,
                    level: record.fields.Level,
                    title: record.fields.Name,
                    fit: 'Fit(Name)' in record.fields ? record.fields['Fit(Name)'] : [],
                    unfit: 'Unfit(Name)' in record.fields ? record.fields['Unfit(Name)'] : []
                }
            })
            cache.put(SKILLS_CACHE_KEY, skills, SKILLS_CACHE_DURATION)
        }
        return skills
    }
}
export const skillService = new SkillService()