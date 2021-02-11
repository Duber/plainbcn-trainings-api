export default class UserSkillMapper {
    Map(data, email) {
        return data.records.map(record => {
            return {
                id: record.id,
                area: record.fields.Area,
                level: record.fields.Level,
                title: record.fields.Name,
                scope: record.fields.Scope ?? null,
                accomplished: isAccomplished(record, email),
                published: record.fields.Published
            }
        })
    }
}

function isAccomplished(record, email) {
    const fit = record.fields['Fit(Email)'] ?? []
    const unfit = record.fields['Unfit(Email)'] ?? []
    if (fit.includes(email))
        return true
    if (unfit.includes(email))
        return false
    return null
}