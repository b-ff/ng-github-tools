/**
 * Helping service for sending requests to GitHub API server
 *
 * If you plan to send your custom requests instantly without using existing methods
 * of any other service from this module, then preferred to use methods of this service instead.
 * That helps to avoid a lot of dependencies and many unnecessary code duplication
 */

(() => {
    let _api;
    let _http;
    let _auth;
    let _getFullUrl;

    class ghRequestServiceClass {
        constructor ($http, $ghApiHost, $ghAuthService) {
            _api = $ghApiHost;
            _http = $http;
            _auth = $ghAuthService;

            _getFullUrl = (url) => _api + url;
        }

        /**
         * Send query to GitHub API
         * @param {string} method - GET|PUT|POST|DELETE... etc.
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        send (method, url, data) {
            const fullUrl = _getFullUrl(url);

            return _http({
                url: fullUrl,
                method,
                data
            });
        }

        /**
         * Send authorized query to GitHub API. It allows to extend queries per user limits
         * @param {string} method - GET|PUT|POST|DELETE... etc.
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        sendAuthorized (method, url, data) {
            return _auth.sendAuthorizedRequest(method, url, data);
        }

        /**
         * Send authorized query to GitHub API if user is authorized, otherwise send unauthorized query
         * @param {string} method - GET|PUT|POST|DELETE... etc.
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        sendAsPossible (method, url, data) {
            // check if we logged in
            if (_auth.isLoggedIn()) {
                // then we send authorized method to keep GitHub rate limits high
                return _auth.sendAuthorizedRequest(method, url, data);
            } else {
                const fullUrl = _getFullUrl(url);

                // else send standard request without credentials
                return _http({
                    method,
                    url: fullUrl,
                    data
                });
            }
        }

        /**
         * Shorthand method to send unauthorized GET-query to GitHub API
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        get (url, data) {
            const fullUrl = _getFullUrl(url);

            return _http({
                method: 'GET',
                url: fullUrl,
                data
            });
        }

        /**
         * Shorthand method to send authorized GET-query to GitHub API
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        getAuthorized (url, data) {
            return this.sendAuthorized('GET', url, data);
        }

        /**
         * Shorthand method to send authorized GET-query to GitHub API if user is authorized
         * and otherwise send unauthorized GET-query
         *
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        getAsPossible (url, data) {
            return this.sendAsPossible('GET', url, data);
        }

        /**
         * Shorthand method to send authorized PUT-query to GitHub API
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        put (url, data) {
            return this.sendAuthorized('PUT', url, data);
        }

        /**
         * Shorthand method to send authorized DELETE-query to GitHub API
         * @param {string} url - URL of GitHub API endpoint (hostname not needed)
         * @param {Object} data - set of key:value params
         * @returns {Promise}
         */
        delete (url, data) {
            return this.sendAuthorized('DELETE', url, data);
        }
    }

    angular.module('ngGitHubTools').service('$ghRequestService', [
        '$http',
        '$ghApiHost',
        '$ghAuthService',
        ghRequestServiceClass
    ]);
})();
