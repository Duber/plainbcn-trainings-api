import fetch from 'node-fetch'
import cache from 'memory-cache'

const CACHE_KEY = 'freetrack'
const CACHE_DURATION = 300000

class FreeTrackService {
    async getAll() {
        const url = `${process.env.AIRTABLE_FREETRACK_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async get(id) {
        const data = await this.getAll()
        return data.records.find(i => i.id === id)
    }

    async updateLikes(id, likes) {
        const url = `${process.env.AIRTABLE_FREETRACK_URL}?api_key=${process.env.AIRTABLE_KEY}`
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                records: [{
                    id: id,
                    fields: {
                        Likes: likes
                    }
                }]
            })
        }
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(`updateLikes with id ${id} and likes ${JSON.stringify(likes)} resulted in ${res.status}:${res.statusText}`)
        cache.del(CACHE_KEY)
    }
}
export const freeTrackService = new FreeTrackService()