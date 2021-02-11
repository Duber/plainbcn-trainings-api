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
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async updateEvaluation(skillId, userId, isAccomplished) {
        const data = await this.getAll()
        const skill = data.records.find(d=> d.id === skillId)
        let fit = skill.fields.Fit ?? []
        let unfit = skill.fields.Unfit ?? []

        fit = fit.filter(s => s !== userId)
        unfit = unfit.filter(s => s !== userId)
        
        if (isAccomplished === null){

        } else if (isAccomplished){
            fit.push(userId)
        } else {
            unfit.push(userId)
        }

        const url = `${process.env.AIRTABLE_SKILLS_URL}?api_key=${process.env.AIRTABLE_KEY}`
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                records: [{
                    id: skillId,
                    fields: {
                        Fit: fit,
                        Unfit: unfit
                    }
                }]
            })
        }
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`updateEvaluation with skillId ${skillId} and userId ${userId} and accomplished ${isAccomplished} resulted in ${res.status}:${res.statusText}`)
        cache.del(CACHE_KEY)
    }
}
export const skillService = new SkillService()