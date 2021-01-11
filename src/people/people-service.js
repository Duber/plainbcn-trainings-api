import fetch from 'node-fetch'
import cache from 'memory-cache'

const CACHE_KEY = 'people'
const CACHE_DURATION = 300000

class PeopleService {
    async getAll() {
        const url = `${process.env.AIRTABLE_PEOPLE_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async get(email) {
        const data = await this.getAll()
        return data.records.find(i => i.fields.Email === email)
    }
}

export const peopleService = new PeopleService()