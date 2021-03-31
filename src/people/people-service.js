import fetch from 'node-fetch'
import cache from 'memory-cache'
import PeopleMapper from './people-mapper.js'

const CACHE_KEY_PREFIX = 'people'
const CACHE_DURATION = 300000

class PeopleService {
    async get(email) {
        const cacheKey = `${CACHE_KEY_PREFIX}_${email}`
        let user = cache.get(cacheKey)
        if (!user) {
            const url = `${process.env.AIRTABLE_PEOPLE_URL}?api_key=${process.env.AIRTABLE_KEY}&filterByFormula={Email}="${email}"`
            const response = await fetch(url).then((result) => result.json())
            if (response.records.length === 0) throw { name: "UserNotFound" }
            user = response.records.map(PeopleMapper.Map)[0]
            cache.put(cacheKey, user, CACHE_DURATION)
        }
        return user
    }

    async create(email) {
        const url = `${process.env.AIRTABLE_PEOPLE_URL}?api_key=${process.env.AIRTABLE_KEY}`
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                records: [{
                    fields: {
                        Email: email
                    }
                }]
            })
        }
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`PeopleService.Create for email ${email} failed with status: ${res.status}:${res.statusText}`)
    }

    async getOrCreate(email) {
        let user
        try {
            user = await this.get(email)
        } catch (error) {
            if (error.name === "UserNotFound") {
                await this.create(email)
                user = await this.get(email)
            }
        }
        return user
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
                        "FreeTrack(Likes)": data.freetrack.likes,
                        "Skills(NotInterested)": data.skills.notInterested
                    }
                }]
            })
        }
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`PeopleService.Patch for id ${id} and data ${JSON.stringify(data)} failed with status: ${res.status}:${res.statusText}`)
        cache.del(`${CACHE_KEY_PREFIX}_${data.email}`)
    }
}

export const peopleService = new PeopleService()