const btoa = require("btoa");
const fetch = require("node-fetch");

const OAuth2 = "https://discordapp.com/api/oauth2/";
const UserEndpoint = "http://discordapp.com/api/v6/users/@me";

class GoogleAPI {
    
    /** @param {APIServer} app */
    constructor(app) {

        this.app = app;
        this.authorization = "Basic " + 
            btoa(`${this.config.Auth.Discord.ID}:` + 
                 `${this.config.Auth.Discord.Redirect}`);
    }

    get config() { return this.app.config; }
    get logger() { return this.app.logger; }

    /**
     * @param {String} code
     * @param {Boolean} refresh
     * @returns {DiscordResponse & DiscordAuthorization}
     */
    async exchange(code, refresh) {

        const type = refresh ? "refresh_token" : "authorization_code";
        const codeType = refresh ? "refresh_token" : "code";
        const url = `${OAuth2}token?grant_type=${type}&${codeType}=${code}&` + 
                    `redirect_uri=${this.config.Auth.Discord.Redirect}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { Authorization: this.authorization }
        });

        return await response.json();
    }

    /**
     * @param {String} discordAccessToken
     * @returns {DiscordResponse & DiscordUser}
     */
    async fetchUserInfo(discordAccessToken) {

        const response = await fetch(UserEndpoint, {
            method: "GET",
            headers: { Authorization : `Bearer ${discordAccessToken}` }
        });
        return await response.json();
    }

    /**
     * @param {String} discordAccessToken
     * @returns {DiscordResponse}
     */
    async revoke(discordAccessToken) {

        const response = await fetch(`${OAuth2}revoke?token=${discordAccessToken}`, {
            method: "POST",
            headers: { Authorization: this.authorization }
        });
        return await response.json();
    }
}

module.exports = GoogleAPI;
