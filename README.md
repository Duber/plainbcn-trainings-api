# PLAINBCN-TRAININGS-API
API for internal training program data.

Built with expressjs.

## ENDPOINTS
### GET /api/skills
Secured with AAD. Requieres header Authorization with bearer token.
Response schema:
```
[{
    "id": "",
    "area": "",
    "level": "",
    "title": "",
    "accomplished": true/false/null
}]
```

## Development

### AAD APP
Create an AAD APP representing this api and:
- update its manifest with ```"accessTokenAcceptedVersion": 2```
- in expose an api, add scope 'auth' and authorize web client app to it

### Running locally
Create your .env file based on .env.example.

```
npm install
npm run dev
```