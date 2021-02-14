import fetch from 'node-fetch'
import cache from 'memory-cache'
import PeopleMapper from './people-mapper.js'

const CACHE_KEY = 'people'
const CACHE_DURATION = 300000

class PeopleService {
    async getAll() {
        const url = `${process.env.AIRTABLE_PEOPLE_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            data = data.records.map(PeopleMapper.Map)
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async get(email) {
        const data = await this.getAll()
        return data.find(i => i.email === email)
    }

    async patch(id, data) {
        const url = `${process.env.AIRTABLE_PEOPLE_URL}?api_key=${process.env.AIRTABLE_KEY}`
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                records: [{
                    id: id,
                    fields: {
                        "Skills(Fit)": data.skills.fit,
                        "Skills(Unfit)": data.skills.unfit,
                        "FreeTrack(Likes)": data.freetrack.likes
                    }
                }]
            })
        }
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`PeopleService.Patch for id ${id} and data ${JSON.stringify(data)} failed with status: ${res.status}:${res.statusText}`)
        cache.del(CACHE_KEY)
    }
}

export const peopleService = new PeopleService()