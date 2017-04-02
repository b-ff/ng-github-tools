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
        constructor($http, $ghApiHost, $ghAuthService) {
            _api = $ghApiHost;
            _http = $http;
            _auth = $ghAuthService;

            _getFullUrl = (url) => _api + url;
        }

        send(method, url, data) {
            url = _getFullUrl(url);

            return _http({
                url,
                method,
                data
            });
        }

        sendAuthorized(method, url, data) {
            return _auth.sendAuthorizedRequest(method, url, data);
        }

        sendAsPossible(method, url, data) {
            // check if we logged in
            if (_auth.isLoggedIn()) {
                // then we send authorized method to keep GitHub rate limits high
                return _auth.sendAuthorizedRequest(method, url, data);
            } else {
                url = _getFullUrl(url);

                // else send standard request without credentials
                return _http({
                    method,
                    url,
                    data
                });
            }
        }

        get(url, data) {
            return _http({
                method: 'GET',
                url,
                data
            });
        }

        getAuthorized(url, data) {
            return this.sendAuthorized('GET', url, data);
        }

        getAsPossible(url, data) {
            return this.sendAsPossible('GET', url, data);
        }

        put(url, data) {
            return this.sendAuthorized('PUT', url, data);
        }

        delete(url, data) {
            return this.sendAuthorized('DELETE', url, data);
        }
    }

    angular.module('ngGitHubTools').service('$ghRequestService', ['$http', '$ghApiHost', '$ghAuthService', ghRequestServiceClass]);

})();
