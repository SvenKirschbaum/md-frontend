import Keycloak from 'keycloak-js'

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({
    url: 'https://id.elite12.de',
    realm: 'elite12',
    clientId: 'markusdope-frontend'
})

export default keycloak
