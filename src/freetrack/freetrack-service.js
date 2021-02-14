import fetch from 'node-fetch'
import cache from 'memory-cache'
import FreeTrackMapper from './freetrack-mapper.js'

const CACHE_KEY = 'freetrack'
const CACHE_DURATION = 300000

class FreeTrackService {
    async getAll() {
        const url = `${process.env.AIRTABLE_FREETRACK_URL}?api_key=${process.env.AIRTABLE_KEY}`
        let data = cache.get(CACHE_KEY)
        if (!data) {
            data = await fetch(url).then((result) => result.json())
            data = data.records.map(FreeTrackMapper.Map)
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }

    async get(id) {
        const data = await this.getAll()
        return data.find(i => i.id === id)
    }
}
export const freeTrackService = new FreeTrackService()