import jwt from 'jsonwebtoken'
import DownloadPublicKey from './public-key-downloader.js'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const key = await getKey(token)
        const decodedtoken = jwt.verify(token, key)
        if (decodedtoken.iss !== process.env.TOKEN_ISSUER) {
            throw new Error('Unexpected token issuer')
        }
        req.user = { email: decodedtoken.preferred_username }
        next()
    } catch (error) {
        console.error(error)
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}

function getKey(token) {
    const decodedToken = jwt.decode(token, { complete: true })
    const keysUrl = `https://login.microsoftonline.com/${decodedToken.payload.tid}/discovery/v2.0/keys`
    return DownloadPublicKey(keysUrl, decodedToken.header.kid)
}

export default auth