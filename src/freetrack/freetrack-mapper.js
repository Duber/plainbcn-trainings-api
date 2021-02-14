export default class FreeTrackMapper {
    static Map(data) {
        return {
            id: data.id,
            area: data.fields.Area ?? '',
            level: data.fields.Level ?? '',
            title: data.fields.Title ?? '',
            type: data.fields.Type ?? '',
            owner: data.fields['Owner(Email)'] ?? null,
            notes: data.fields.Notes ?? null,
            scheduled: data.fields.Scheduled ?? null,
            likes: (data.fields.Likes ?? []).length
        }
    }
}