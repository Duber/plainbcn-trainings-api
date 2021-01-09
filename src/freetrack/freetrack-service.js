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
            data = data.records.map((record) => {
                return {
                    id: record.id,
                    area: record.fields.Area,
                    level: record.fields.Level,
                    title: record.fields.Title,
                    type: record.fields.Type,
                    owners: record.fields['Owner(Name)'],
                    notes: record.fields.Notes,
                    scheduled: record.fields.Scheduled,
                    likes: (record.fields.Likes ?? []).length
                }
            })
            cache.put(CACHE_KEY, data, CACHE_DURATION)
        }
        return data
    }
}
export const freeTrackService = new FreeTrackService()