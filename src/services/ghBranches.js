/**
 * Service for working with GitHub repository branches API
 */

(() => {
    let _req;

    class ghBranchesServiceClass {
        constructor ($ghRequestService) {
            _req = $ghRequestService;
        }

        /**
         * Get list of repository branches
         *
         * https://developer.github.com/v3/repos/branches/#list-branches
         *
         * @param ownerName {String} - username (login) of the repo owner
         * @param repositoryName {String} - name of the repository
         * @returns {Promise}
         */
        getBranches (ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/branches`);
        }

        /**
         * Get branch information
         *
         * https://developer.github.com/v3/repos/branches/#get-branch
         *
         * @param ownerName {String} - username (login) of the repo owner
         * @param repositoryName {String} - name of the repository
         * @param branchName {String} - name of the branch
         * @returns {Promise}
         */
        getBranch (ownerName, repositoryName, branchName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/branches/${branchName}`);
        }
    }

    angular.module('ngGitHubTools')
        .service('$ghBranchesService', ['$ghRequestService', ghBranchesServiceClass]);
})();
