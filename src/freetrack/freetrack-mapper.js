export default class FreeTrackMapper {
    Map(data, email){
        return data.records.map((record) => {
            return {
                id: record.id,
                area: record.fields.Area ?? '',
                level: record.fields.Level ?? '',
                title: record.fields.Title ?? '',
                type: record.fields.Type ?? '',
                owner: record.fields['Owner(Email)'] ?? null,
                notes: record.fields.Notes ?? null,
                scheduled: record.fields.Scheduled ?? null,
                likes: (record.fields.Likes ?? []).length,
                liked: (record.fields['Likes(Email)'] ?? []).includes(email)
            }
        })
    }
}