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
        constructor($http, $ghApiHost, $ghBase64Service) {
            _api = $ghApiHost;
            _http = $http;

            // set private function to encode auth data to base64 GitHub format
            _encodeAuthData = (login, password) => $ghBase64Service.encode(`${login}:${password}`);
        }

        login(login, password) {
            let authData = _encodeAuthData(login, password);

            return _http({
                method: 'GET',
                url: _api,
                headers: {
                    'Authorization': 'Basic ' + authData
                }
            }).then(() => {
                _isLogged = true;
                _currentLogin = login;
                _encodedAuthData = authData;
            }, this.logout);
        }

        logout() {
            _isLogged = false;
            _currentLogin = null;
            _encodeAuthData = '';
        }

        isLoggedIn() {
            return _isLogged;
        }

        getCurrentLogin() {
            return _currentLogin;
        }

        sendAuthorizedRequest(method, apiURL, data) {
            if (!this.isLoggedIn()) return false;

            return _http({
                method: method.toUpperCase(),
                url: _api + apiURL,
                headers: {
                    'Authorization': 'Basic ' + _encodedAuthData
                },
                data: data
            });
        }
    }

    angular.module('ngGitHubTools').service('$ghAuthService', ['$http', '$ghApiHost', '$ghBase64Service', ghAuthServiceClass]);

})();
