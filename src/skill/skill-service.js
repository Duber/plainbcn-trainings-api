import fetch from 'node-fetch'
import cache from 'memory-cache'

const CACHE_KEY = 'skills'
const CACHE_DURATION = 300000

class SkillService {
    async getAll() {
        const url = `${process.env.AIRTABLE_SKILLS_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            data = data.records.map((record) => {
                return {
                    id: record.id,
                    area: record.fields.Area,
                    level: record.fields.Level,
                    title: record.fields.Name,
                    fit: 'Fit(Name)' in record.fields ? record.fields['Fit(Name)'] : [],
                    unfit: 'Unfit(Name)' in record.fields ? record.fields['Unfit(Name)'] : []
                }
            })
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }
}
export const skillService = new SkillService()