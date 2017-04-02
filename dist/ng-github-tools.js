/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('ngGitHubTools', []).constant('$ghApiHost', 'https://api.github.com/');

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service for working with GitHub authorization API
 */

(function () {

    var _api = void 0;
    var _http = void 0;
    var _isLogged = void 0;
    var _currentLogin = void 0;
    var _encodeAuthData = void 0;
    var _encodedAuthData = void 0;

    var ghAuthServiceClass = function () {
        function ghAuthServiceClass($http, $ghApiHost, $ghBase64Service) {
            _classCallCheck(this, ghAuthServiceClass);

            _api = $ghApiHost;
            _http = $http;

            // set private function to encode auth data to base64 GitHub format
            _encodeAuthData = function _encodeAuthData(login, password) {
                return $ghBase64Service.encode(login + ':' + password);
            };
        }

        _createClass(ghAuthServiceClass, [{
            key: 'login',
            value: function login(_login, password) {
                var authData = _encodeAuthData(_login, password);

                return _http({
                    method: 'GET',
                    url: _api,
                    headers: {
                        'Authorization': 'Basic ' + authData
                    }
                }).then(function () {
                    _isLogged = true;
                    _currentLogin = _login;
                    _encodedAuthData = authData;
                }, this.logout);
            }
        }, {
            key: 'logout',
            value: function logout() {
                _isLogged = false;
                _currentLogin = null;
                _encodeAuthData = '';
            }
        }, {
            key: 'isLoggedIn',
            value: function isLoggedIn() {
                return _isLogged;
            }
        }, {
            key: 'getCurrentLogin',
            value: function getCurrentLogin() {
                return _currentLogin;
            }
        }, {
            key: 'sendAuthorizedRequest',
            value: function sendAuthorizedRequest(method, apiURL, data) {
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
        }]);

        return ghAuthServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghAuthService', ['$http', '$ghApiHost', '$ghBase64Service', ghAuthServiceClass]);
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helping service for encoding data to base64 and decode it back
 */

(function () {

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode(c >> 6 | 192);
                utftext += String.fromCharCode(c & 63 | 128);
            } else {
                utftext += String.fromCharCode(c >> 12 | 224);
                utftext += String.fromCharCode(c >> 6 & 63 | 128);
                utftext += String.fromCharCode(c & 63 | 128);
            }
        }

        return utftext;
    };

    var _utf8_decode = function _utf8_decode(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode((c & 31) << 6 | c2 & 63);
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                i += 3;
            }
        }

        return string;
    };

    var ghBase64ServiceClass = function () {
        function ghBase64ServiceClass() {
            _classCallCheck(this, ghBase64ServiceClass);
        }

        _createClass(ghBase64ServiceClass, [{
            key: "encode",
            value: function encode(input) {
                var output = "";
                var chr1 = void 0,
                    chr2 = void 0,
                    chr3 = void 0,
                    enc1 = void 0,
                    enc2 = void 0,
                    enc3 = void 0,
                    enc4 = void 0;
                var i = 0;

                input = _utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                }

                return output;
            }
        }, {
            key: "decode",
            value: function decode(input) {
                var output = "";
                var chr1 = void 0,
                    chr2 = void 0,
                    chr3 = void 0;
                var enc1 = void 0,
                    enc2 = void 0,
                    enc3 = void 0,
                    enc4 = void 0;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                while (i < input.length) {

                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));

                    chr1 = enc1 << 2 | enc2 >> 4;
                    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                    chr3 = (enc3 & 3) << 6 | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }

                output = _utf8_decode(output);

                return output;
            }
        }]);

        return ghBase64ServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghBase64Service', [ghBase64ServiceClass]);
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service for working with GitHub repository branches API
 */

(function () {
    var _req = void 0;

    var ghBranchesServiceClass = function () {
        function ghBranchesServiceClass($ghRequestService) {
            _classCallCheck(this, ghBranchesServiceClass);

            _req = $ghRequestService;
        }

        /**
         * Get list of repository branches
         *
         * https://developer.github.com/v3/repos/branches/#list-branches
         *
         * @param ownerName {String} - username (login) of the repo owner
         * @param repositoryName {String} - name of the repository
         * @returns $q
         */


        _createClass(ghBranchesServiceClass, [{
            key: 'getBranches',
            value: function getBranches(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/branches');
            }

            /**
             * Get branch information
             *
             * https://developer.github.com/v3/repos/branches/#get-branch
             *
             * @param ownerName {String} - username (login) of the repo owner
             * @param repositoryName {String} - name of the repository
             * @param branchName {String} - name of the branch
             * @returns $q
             */

        }, {
            key: 'getBranch',
            value: function getBranch(ownerName, repositoryName, branchName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/branches/' + branchName);
            }
        }]);

        return ghBranchesServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghBranchesService', ['$ghRequestService', ghBranchesServiceClass]);
})();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service for working with GitHub contents
 */

(function () {
    var _req = void 0;

    var ghContentsServiceClass = function () {
        function ghContentsServiceClass($ghRequestService) {
            _classCallCheck(this, ghContentsServiceClass);

            _req = $ghRequestService;
            this.username = '';
            this.repositoryName = '';
        }

        _createClass(ghContentsServiceClass, [{
            key: 'setRepository',
            value: function setRepository(username, repositoryName) {
                this.username = username;
                this.repositoryName = repositoryName;
                return this;
            }
        }, {
            key: 'getBasePath',
            value: function getBasePath() {
                return 'repos/' + this.username + '/' + this.repositoryName;
            }
        }, {
            key: 'getReadme',
            value: function getReadme() {
                return _req.getAsPossible(this.getBasePath() + '/readme');
            }
        }, {
            key: 'getContents',
            value: function getContents(path, ref) {
                return _req.getAsPossible(this.getBasePath() + '/contents/' + path, ref ? { ref: ref } : {});
            }
        }, {
            key: 'createFile',
            value: function createFile(path, message, content, committer, author, branch) {
                var params = {
                    message: message,
                    content: content
                };

                if (committer) params.committer = committer;
                if (author) params.author = author;
                if (branch) params.branch = branch;

                return _req.put(this.getBasePath() + '/contents/' + path, params);
            }
        }, {
            key: 'updateFile',
            value: function updateFile(path, message, content, sha, committer, author, branch) {
                var params = {
                    message: message,
                    content: content,
                    sha: sha
                };

                if (committer) params.committer = committer;
                if (author) params.author = author;
                if (branch) params.branch = branch;

                return _req.put(this.getBasePath() + '/contents/' + path, params);
            }
        }, {
            key: 'deleteFile',
            value: function deleteFile(path, message, content, sha, committer, author, branch) {
                var params = {
                    message: message,
                    content: content,
                    sha: sha
                };

                if (committer) params.committer = committer;
                if (author) params.author = author;
                if (branch) params.branch = branch;

                return _req.delete(this.getBasePath() + '/contents/' + path, params);
            }
        }, {
            key: 'getArchiveLink',
            value: function getArchiveLink(archive_format, ref) {
                return _req.getAsPossible(this.getBasePath() + '/' + (archive_format || 'tarball') + '/' + ref);
            }
        }]);

        return ghContentsServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghContentsService', ['$ghRequestService', ghContentsServiceClass]);
})();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service for working with GitHub repositories API
 */

(function () {
    var _req = void 0;

    var ghRepositoriesServiceClass = function () {
        function ghRepositoriesServiceClass($ghRequestService) {
            _classCallCheck(this, ghRepositoriesServiceClass);

            _req = $ghRequestService;
        }

        /**
         * List repositories that are accessible to the authenticated user.
         *
         * This includes repositories owned by the authenticated user,
         * repositories where the authenticated user is a collaborator,
         * and repositories that the authenticated user has access to
         * through an organization membership.
         *
         * https://developer.github.com/v3/repos/#list-your-repositories
         *
         * @returns $q
         */


        _createClass(ghRepositoriesServiceClass, [{
            key: 'getCurrentUserRepos',
            value: function getCurrentUserRepos() {
                return _req.getAsPossible('user/repos');
            }

            /**
             * List public repositories for the specified user.
             *
             * https://developer.github.com/v3/repos/#list-user-repositories
             *
             * @param username {String} - username (login) of the user
             *
             * @returns $q
             */

        }, {
            key: 'getUserRepos',
            value: function getUserRepos(username) {
                return _req.getAsPossible('users/' + username + '/repos');
            }

            /**
             * List repositories for the specified org.
             *
             * https://developer.github.com/v3/repos/#list-organization-repositories
             *
             * @param orgName {String} - organization name
             *
             * @returns $q
             */

        }, {
            key: 'getOrganizationRepos',
            value: function getOrganizationRepos(orgName) {
                return _req.getAsPossible('orgs/' + orgName + '/repos');
            }

            /**
             * This provides a dump of every public repository, in the order that they were created.
             *
             * Note: Pagination is powered exclusively by the since parameter.
             * Use the Link header (https://developer.github.com/v3/#link-header)
             * to get the URL for the next page of repositories.
             *
             * https://developer.github.com/v3/repos/#list-all-public-repositories
             *
             * @returns $q
             */

        }, {
            key: 'getAllPublicRepos',
            value: function getAllPublicRepos() {
                return _req.getAsPossible('repositories');
            }

            /**
             * Create a new repository for the authenticated user.
             *
             * https://developer.github.com/v3/repos/#create
             *
             * @param repositoryData {Object} - repository data
             * @param repositoryData.name {String} - Required. The name of the repository
             * @param repositoryData.description {String} - A short description of the repository
             * @param repositoryData.homepage {String} - A URL with more information about the repository
             * @param repositoryData.private {boolean} - Either true to create a private repository, or false to create a public one. Creating private repositories requires a paid GitHub account. Default: false
             * @param repositoryData.has_issues {boolean} - Either true to enable issues for this repository, false to disable them. Default: true
             * @param repositoryData.has_wiki {boolean} - Either true to enable the wiki for this repository, false to disable it. Default: true
             * @param repositoryData.has_downloads {boolean} - Either true to enable downloads for this repository, false to disable them. Default: true
             * @param repositoryData.team_id {Number} - The id of the team that will be granted access to this repository. This is only valid when creating a repository in an organization.
             * @param repositoryData.auto_init {boolean} - Pass true to create an initial commit with empty README. Default: false
             * @param repositoryData.gitignore_template {String} - Desired language or platform .gitignore template (https://github.com/github/gitignore) to apply. Use the name of the template without the extension. For example, "Haskell".
             * @param repositoryData.license_template {String} - Desired LICENSE template (https://github.com/github/choosealicense.com) to apply. Use the name of the template (https://github.com/github/choosealicense.com/tree/gh-pages/_licenses) without the extension. For example, "mit" or "mozilla".
             *
             * @returns $q
             */

        }, {
            key: 'createUserRepository',
            value: function createUserRepository(repositoryData) {
                return _req.sendAuthorized('POST', 'user/repos', repositoryData);
            }

            /**
             * Create a new repository in this organization.
             * The authenticated user must be a member of the specified organization.
             *
             * https://developer.github.com/v3/repos/#create
             *
             * @param organizationName {String} - the name of organization where you plan to create repo
             * @param repositoryData {Object} - repository data, format is the same as in createUserRepository() method
             *
             * @returns $q
             */

        }, {
            key: 'createOrgRepository',
            value: function createOrgRepository(organizationName, repositoryData) {
                return _req.sendAuthorized('POST', 'orgs/' + organizationName + '/repos', repositoryData);
            }

            /**
             * Get repository by its owner and name
             *
             * https://developer.github.com/v3/repos/#get
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName {String} - repository name
             * @returns $q
             */

        }, {
            key: 'getRepository',
            value: function getRepository(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName);
            }

            /**
             * Edit a repository
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName {String} - repository name
             * @param repositoryData {Object} - new repository data
             * @param repositoryData.name {String} - Required. The name of the repository
             * @param repositoryData.description {String} - A short description of the repository
             * @param repositoryData.homepage {String} - A URL with more information about the repository
             * @param repositoryData.private {boolean} - Either true to make the repository private, or false to make it public. Creating private repositories requires a paid GitHub account. Default: false
             * @param repositoryData.has_issues {boolean} - Either true to enable issues for this repository, false to disable them. Default: true
             * @param repositoryData.has_wiki {boolean} - Either true to enable the wiki for this repository, false to disable it. Default: true
             * @param repositoryData.has_downloads {boolean} - Either true to enable downloads for this repository, false to disable them. Default: true
             * @param repositoryData.default_branch {String} - Updates the default branch for this repository.
             *
             * @returns {*}
             */

        }, {
            key: 'editRepository',
            value: function editRepository(ownerName, repositoryName, repositoryData) {
                return _req.sendAuthorized('PATCH', 'repos/' + ownerName + '/' + repositoryName, repositoryData);
            }

            /**
             * List contributors to the specified repository,
             * sorted by the number of commits per contributor in descending order.
             *
             * Contributors data is cached for performance reasons.
             * This endpoint may return information that is a few hours old.
             * Git contributors are identified by author email address. This API attempts to group contribution counts
             * by GitHub user, across all of their associated email addresses. For performance reasons,
             * only the first 500 author email addresses in the repository will be linked to GitHub users.
             * The rest will appear as anonymous contributors without associated GitHub user information.
             *
             * https://developer.github.com/v3/repos/#list-contributors
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName - {String} repository name
             * @returns $q
             */

        }, {
            key: 'getRepoContributors',
            value: function getRepoContributors(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/contributors');
            }

            /**
             * List languages for the specified repository.
             * The value on the right of a language is the number of bytes of code written in that language.
             *
             * https://developer.github.com/v3/repos/#list-languages
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName - {String} repository name
             * @returns $q
             */

        }, {
            key: 'getRepoLanguages',
            value: function getRepoLanguages(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/languages');
            }

            /**
             * Get teams of repository
             *
             * https://developer.github.com/v3/repos/#list-teams
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName - {String} repository name
             * @returns $q
             */

        }, {
            key: 'getRepoTeams',
            value: function getRepoTeams(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/teams');
            }

            /**
             * Get available tags for repository
             *
             * https://developer.github.com/v3/repos/#list-tags
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName - {String} repository name
             * @returns $q
             */

        }, {
            key: 'getRepoTags',
            value: function getRepoTags(ownerName, repositoryName) {
                return _req.getAsPossible('repos/' + ownerName + '/' + repositoryName + '/tags');
            }

            /**
             * Deleting a repository requires admin access. If OAuth is used, the delete_repo scope is required.
             *
             * https://developer.github.com/v3/repos/#delete-a-repository
             *
             * @param ownerName {String} - username (login) of repo owner
             * @param repositoryName - {String} repository name
             * @returns $q
             */

        }, {
            key: 'deleteRepository',
            value: function deleteRepository(ownerName, repositoryName) {
                return _req.sendAuthorized('DELETE', 'repos/' + ownerName + '/' + repositoryName);
            }
        }]);

        return ghRepositoriesServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghRepositoriesService', ['$ghRequestService', ghRepositoriesServiceClass]);
})();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helping service for sending requests to GitHub API server
 *
 * If you plan to send your custom requests instantly without using existing methods
 * of any other service from this module, then preferred to use methods of this service instead.
 * That helps to avoid a lot of dependencies and many unnecessary code duplication
 */

(function () {

    var _api = void 0;
    var _http = void 0;
    var _auth = void 0;
    var _getFullUrl = void 0;

    var ghRequestServiceClass = function () {
        function ghRequestServiceClass($http, $ghApiHost, $ghAuthService) {
            _classCallCheck(this, ghRequestServiceClass);

            _api = $ghApiHost;
            _http = $http;
            _auth = $ghAuthService;

            _getFullUrl = function _getFullUrl(url) {
                return _api + url;
            };
        }

        _createClass(ghRequestServiceClass, [{
            key: 'send',
            value: function send(method, url, data) {
                url = _getFullUrl(url);

                return _http({
                    url: url,
                    method: method,
                    data: data
                });
            }
        }, {
            key: 'sendAuthorized',
            value: function sendAuthorized(method, url, data) {
                return _auth.sendAuthorizedRequest(method, url, data);
            }
        }, {
            key: 'sendAsPossible',
            value: function sendAsPossible(method, url, data) {
                // check if we logged in
                if (_auth.isLoggedIn()) {
                    // then we send authorized method to keep GitHub rate limits high
                    return _auth.sendAuthorizedRequest(method, url, data);
                } else {
                    url = _getFullUrl(url);

                    // else send standard request without credentials
                    return _http({
                        method: method,
                        url: url,
                        data: data
                    });
                }
            }
        }, {
            key: 'get',
            value: function get(url, data) {
                return _http({
                    method: 'GET',
                    url: url,
                    data: data
                });
            }
        }, {
            key: 'getAuthorized',
            value: function getAuthorized(url, data) {
                return this.sendAuthorized('GET', url, data);
            }
        }, {
            key: 'getAsPossible',
            value: function getAsPossible(url, data) {
                return this.sendAsPossible('GET', url, data);
            }
        }, {
            key: 'put',
            value: function put(url, data) {
                return this.sendAuthorized('PUT', url, data);
            }
        }, {
            key: 'delete',
            value: function _delete(url, data) {
                return this.sendAuthorized('DELETE', url, data);
            }
        }]);

        return ghRequestServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghRequestService', ['$http', '$ghApiHost', '$ghAuthService', ghRequestServiceClass]);
})();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Service for working with GitHub users API
 */

(function () {

    var _req = void 0;

    var ghUsersServiceClass = function () {
        function ghUsersServiceClass($ghRequestService) {
            _classCallCheck(this, ghUsersServiceClass);

            _req = $ghRequestService;
        }

        _createClass(ghUsersServiceClass, [{
            key: 'getUserByUsername',
            value: function getUserByUsername(username) {
                return _req.getAsPossible('users/' + username);
            }
        }, {
            key: 'getCurrentUser',
            value: function getCurrentUser() {
                return _req.getAsPossible('user');
            }
        }, {
            key: 'getAllUsers',
            value: function getAllUsers(since) {
                return _req.getAsPossible('users', { since: since });
            }
        }]);

        return ghUsersServiceClass;
    }();

    angular.module('ngGitHubTools').service('$ghUsersService', ['$ghRequestService', ghUsersServiceClass]);
})();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

__webpack_require__(2);

__webpack_require__(6);

__webpack_require__(1);

__webpack_require__(7);

__webpack_require__(5);

__webpack_require__(3);

__webpack_require__(4);

/***/ })
/******/ ]);
//# sourceMappingURL=ng-github-tools.js.map