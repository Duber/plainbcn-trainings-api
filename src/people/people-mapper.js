export default class PeopleMapper {
    static Map(data) {
        return {
            id: data.id,
            email: data.fields.Email,
            skills: {
                fit: data.fields['Skills(Fit)'] ?? [],
                unfit: data.fields['Skills(Unfit)'] ?? []
            },
            freetrack: {
                likes: data.fields['FreeTrack(Likes)'] ?? []
            }
        }
    }
}