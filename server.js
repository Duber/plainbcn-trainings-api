import cors from 'cors'
import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import passport from 'passport'
import * as passportAzureAd from 'passport-azure-ad'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const server = express()
const port = 3001

server.use(cors())

server.get('/', (req, res) => {
    res.send()
})

server.use(passport.initialize());
var options =  {
    identityMetadata: "https://login.microsoftonline.com/8c4daf01-5412-4589-86ff-f5efa0c2834f/v2.0/.well-known/openid-configuration",
    clientID: "d3e21b0d-1460-45e7-8854-32333791077c",
    issuer: "https://login.microsoftonline.com/8c4daf01-5412-4589-86ff-f5efa0c2834f/v2.0",
    loggingLevel: "error",
    audience: "24ebf232-d6f5-4e7b-bacd-e95ea35fca58",
    passReqToCallback: false
  };
var bearerStrategy = new passportAzureAd.BearerStrategy(options, function (token, done) {
    done(null, {}, token);
});
passport.use(bearerStrategy);


server.get('/api/skills', passport.authenticate("oauth-bearer", { session: false }), async (req, res) => {
    console.log("User info: ", req.user);
    const url = `https://api.airtable.com/v0/appIJ1OyA5ly2fcib/Skills?api_key=${process.env.AIRTABLE_KEY}`
    let data = await fetch(url).then((result) => result.json())
    data = data.records.map((record) => {
        return {
            id: record.id,
            area: record.fields.Area,
            level: record.fields.Level,
            title: record.fields.Name,
            accomplished: false
        }
    })
    res.json(data)
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
