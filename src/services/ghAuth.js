/**
 * Service for working with GitHub authorization API
 */

(() => {
    let _api;
    let _http;
    let _isLogged;
    let _currentLogin;
    let _encodeAuthData;
    let _encodedAuthData;

    class ghAuthServiceClass {
        constructor ($http, $ghApiHost, $ghBase64Service) {
            _api = $ghApiHost;
            _http = $http;

            // set private function to encode auth data to base64 GitHub format
            _encodeAuthData = (login, password) => $ghBase64Service.encode(`${login}:${password}`);
        }

        /**
         * Log-in user with provided credentials
         * @param {string} login
         * @param {string} password
         * @returns {Promise}
         */
        login (login, password) {
            const authData = _encodeAuthData(login, password);

            return _http({
                method: 'GET',
                url: _api,
                headers: {
                    Authorization: `Basic ${authData}`
                }
            }).then(() => {
                _isLogged = true;
                _currentLogin = login;
                _encodedAuthData = authData;
            }, this.logout);
        }

        /**
         * Logout currently logged-in user and drop all encoded credentials
         */
        logout () {
            _isLogged = false;
            _currentLogin = null;
            _encodeAuthData = '';
        }

        /**
         * Check if user is logged in
         * @returns {boolean}
         */
        isLoggedIn () {
            return _isLogged;
        }

        /**
         * Get current authorized user login
         * @returns {string}
         */
        getCurrentLogin () {
            return _currentLogin;
        }

        /**
         * Send authorized request to GitHub API. It allows to extend queries per user limits
         * @param {string} method - GET/POST/PUT/DELETE
         * @param {string} apiURL - URL to API endpoint (hostname not needed)
         * @param {Object} data — set of key:value params
         * @returns {Promise}
         */
        sendAuthorizedRequest (method, apiURL, data) {
            if (!this.isLoggedIn()) return false;

            return _http({
                method: method.toUpperCase(),
                url: _api + apiURL,
                headers: {
                    Authorization: `Basic ${_encodedAuthData}`
                },
                data
            });
        }
    }

    angular.module('ngGitHubTools').service('$ghAuthService', [
        '$http',
        '$ghApiHost',
        '$ghBase64Service',
        ghAuthServiceClass
    ]);
})();
