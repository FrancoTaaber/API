# Photo Gallery API

Photo Gallery API on lihtne REST API, mis võimaldab kasutajatel fotosid lisada, muuta, vaadata ja kustutada. See rakendus kasutab Node.js, Express.js, Socket.IO ja JWT autentimist.

## Funktsioonid

- REST API fotode lisamiseks, muutmiseks, vaatamiseks ja kustutamiseks
- JWT autentimine fotode lisamise, muutmise ja kustutamise jaoks
- API limiit IP-aadressi kohta (100 päringut 15 minuti jooksul)
- Socket.IO fotode lisamise, muutmise ja kustutamise sündmuste edastamiseks
- Integreeritud testid Chai ja Mocha abil
- Võime vaadata API-logisid CSV-failina

## Kasutatud tehnoloogiad

- Node.js
- Express.js
- Socket.IO
- JWT
- Passport.js
- Winston (logimiseks)
- Chai, Mocha (testimiseks)

## Nõuded

- Node.js v14.0.0 või uuem

## Kuidas käivitada

1. Kloonige see repositoorium.
2. Installige sõltuvused:
### `npm install`
3. Käivitage server:
### `node server.js`
Server käivitub pordil 3001.

## API dokumentatsioon

### Saada kõik fotod

- Meetod: GET
- URL: /photos

### Saada foto ID järgi

- Meetod: GET
- URL: /photos/:id

### Lisa uus foto

- Meetod: POST
- URL: /photos
- Päis: Authorization: Bearer <token>
- Keha: JSON objekt, mis sisaldab "title" ja "url"

### Uuenda olemasolevat fotot

- Meetod: PUT
- URL: /photos/:id
- Päis: Authorization: Bearer <token>
- Keha: JSON objekt, mis sisaldab "title" ja "url"

### Kustuta foto

- Meetod: DELETE
- URL: /photos/:id
- Päis: Authorization: Bearer <token>

### Logi sisse

- Meetod: POST
- URL: /login
- Keha: JSON objekt, mis sisaldab "email" ja "password"

## Testimine

Käivitage testid järgmiselt:
### `mocha --recursive src/test/`

## Logide vaatamine

API-logide vaatamiseks CSV-failina tehke päring järgmiselt:

- Meetod: GET
- URL: /logs

## Litsents
See projekt on litsentseeritud MIT litsentsi alusel.

## Failide struktuur
server.js
See fail sisaldab serveri konfiguratsiooni ja käivitamise koodi. See loob Expressi rakenduse, määrab API marsruudid ja käivitab HTTP-serveri koos Socket.IO-ga.

photo.js
See fail sisaldab foto mudelit, mis on lihtne JSON-objektide massiiv. Mudelit saab asendada andmebaasiühendusega.

photoController.js
See fail sisaldab kõiki API-ühenduspunkte foto lisamiseks, värskendamiseks, kustutamiseks ja lugemiseks. Lisaks sisaldab see WebSocket funktsioone fotode reaalajas värskendamiseks.

api.test.js
See fail sisaldab API testide komplekti, mis kasutavad Chai ja Chai-HTTP teeki.

logs.csv
See fail sisaldab logisid, mis salvestatakse serveri töö ajal.

logger.js
See fail sisaldab logimise seadistust ja funktsioone. See kasutab Winstoni teeki logide salvestamiseks.

config.js
See fail sisaldab JWT saladuse konfiguratsiooni.

auth.js
See fail sisaldab JWT autentimise konfiguratsiooni ja funktsioone, kasutades Passport.js teeki.
