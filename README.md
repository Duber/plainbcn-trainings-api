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
    "accomplished": false
}]
```

## RUNNING LOCALLY
```
npm install
npm run dev
```