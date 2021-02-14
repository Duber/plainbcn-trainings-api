export default class SkillMapper {
    static Map(skill) {
        return {
            id: skill.id,
            area: skill.fields.Area,
            level: skill.fields.Level,
            title: skill.fields.Name,
            scope: skill.fields.Scope ?? null,
            published: skill.fields.Published
        }
    }
}