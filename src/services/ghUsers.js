/**
 * Service for working with GitHub users API
 */

(() => {
    let _req;

    class ghUsersServiceClass {
        constructor ($ghRequestService) {
            _req = $ghRequestService;
        }

        /**
         *
         * @param {string} username
         * @returns {Promise}
         */
        getUserByUsername (username) {
            return _req.getAsPossible('users/' + username);
        }

        /**
         * Get information about currently authorized user
         * @returns {Promise}
         */
        getCurrentUser () {
            return _req.getAsPossible('user');
        }

        /**
         * Get list of all users
         * @param {string} since - The integer ID of the last User that you've seen
         * @returns {Promise}
         */
        getAllUsers (since) {
            return _req.getAsPossible('users', { since });
        }
    }

    angular.module('ngGitHubTools').service('$ghUsersService', ['$ghRequestService', ghUsersServiceClass]);
})();
