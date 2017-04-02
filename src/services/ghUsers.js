/**
 * Service for working with GitHub users API
 */

(() => {

    let _req;

    class ghUsersServiceClass {
        constructor($ghRequestService) {
            _req = $ghRequestService;
        }

        getUserByUsername(username) {
            return _req.getAsPossible('users/' + username);
        }

        getCurrentUser() {
            return _req.getAsPossible('user');
        }

        getAllUsers(since) {
            return _req.getAsPossible('users', { since });
        }
    }

    angular.module('ngGitHubTools').service('$ghUsersService', ['$ghRequestService', ghUsersServiceClass]);

})();
