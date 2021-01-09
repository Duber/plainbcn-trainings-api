import fetch from 'node-fetch'

export async function getKeysUrl(issuer){
    const openidConfUrl = `${issuer}/.well-known/openid-configuration`
    const openidConf = await (await fetch(openidConfUrl)).json()
    const keysUrl = openidConf.jwks_uri
    return keysUrl
}