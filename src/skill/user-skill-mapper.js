export default class UserSkillMapper {
    Map(skills, email) {
        return skills.map(skill => {
            return {
                id: skill.id,
                area: skill.area,
                level: skill.level,
                title: skill.title,
                accomplished: isAccomplished(skill, email)
            }
        })
    }
}

function isAccomplished(skill, email) {
    if (skill.fit.includes(email))
        return true
    if (skill.unfit.includes(email))
        return false
    return null
}