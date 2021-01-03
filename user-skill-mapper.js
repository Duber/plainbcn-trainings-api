export default class UserSkillMapper {
    Map(skills, email) {
        return skills.map(skill => {
            return {
                id: skill.id,
                area: skill.area,
                level: skill.level,
                title: skill.title,
                accomplished: skill.people.includes(email)
            }
        })
    }
}