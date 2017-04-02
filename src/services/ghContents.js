/**
 * Service for working with GitHub contents
 */

(() => {
    let _req;

    class ghContentsServiceClass {
        constructor ($ghRequestService) {
            _req = $ghRequestService;
            this.username = '';
            this.repositoryName = '';
        }

        /**
         * Set the username and repository name to work with
         * @param {string} username
         * @param {string} repositoryName
         * @returns {ghContentsServiceClass}
         */
        setRepository (username, repositoryName) {
            this.username = username;
            this.repositoryName = repositoryName;
            return this;
        }

        /**
         * Get API basebath for specified user's repository
         * @returns {string} - GitHub API basepath for repository
         */
        getBasePath () {
            return `repos/${this.username}/${this.repositoryName}`;
        }

        /**
         * Get readme for specified repository
         * @returns {Promise}
         */
        getReadme () {
            return _req.getAsPossible(`${this.getBasePath()}/readme`);
        }

        /**
         * Get content of the file by path and branch/commit (optionally)
         * @param {string} path - path to the file
         * @param {string} ref - (optional) branch name or commit SHA
         * @returns {Promise}
         */
        getContents (path, ref) {
            return _req.getAsPossible(`${this.getBasePath()}/contents/${path}`, (ref) ? { ref } : {});
        }

        /**
         * Creates a file
         * @param {string} path - path to a new file
         * @param {string} message - commit message
         * @param {string} content - encoded with base64 encoding file content
         * @param {Object} committer - (optional) committer credentials
         * @param {string} committer.name - name of committer
         * @param {string} committer.email - committer contact e-mail
         * @param {Object} author - (optional) author credentials. Structure is the same as committer.
         * @param {string} branch - (optional) branch name
         * @returns {Promise}
         */
        createFile (path, message, content, committer, author, branch) {
            const params = {
                message,
                content
            };

            if (committer) params.committer = committer;
            if (author) params.author = author;
            if (branch) params.branch = branch;

            return _req.put(`${this.getBasePath()}/contents/${path}`, params);
        }

        /**
         * Updates a file
         * @param {string} path - path to a new file
         * @param {string} message - commit message
         * @param {string} content - encoded with base64 encoding file content
         * @param {string} sha - SHA of the parent commit
         * @param {Object} committer - (optional) committer credentials
         * @param {string} committer.name - name of committer
         * @param {string} committer.email - committer contact e-mail
         * @param {Object} author - (optional) author credentials. Structure is the same as committer.
         * @param {string} branch - (optional) branch name
         * @returns {Promise}
         */
        updateFile (path, message, content, sha, committer, author, branch) {
            const params = {
                message,
                content,
                sha
            };

            if (committer) params.committer = committer;
            if (author) params.author = author;
            if (branch) params.branch = branch;

            return _req.put(`${this.getBasePath()}/contents/${path}`, params);
        }

        /**
         * Removes a file
         * @param {string} path - path to a new file
         * @param {string} message - commit message
         * @param {string} sha - SHA of the parent commit
         * @param {Object} committer - (optional) committer credentials
         * @param {string} committer.name - name of committer
         * @param {string} committer.email - committer contact e-mail
         * @param {Object} author - (optional) author credentials. Structure is the same as committer.
         * @param {string} branch - (optional) branch name
         * @returns {Promise}
         */
        deleteFile (path, message, sha, committer, author, branch) {
            const params = {
                message,
                sha
            };

            if (committer) params.committer = committer;
            if (author) params.author = author;
            if (branch) params.branch = branch;

            return _req.delete(`${this.getBasePath()}/contents/${path}`, params);
        }

        /**
         * Get archive download link for specified repository
         * @param {string} archiveFormat - zipball|tarball
         * @param ref — (optional) branch name
         * @returns {Promise}
         */
        getArchiveLink (archiveFormat, ref) {
            return _req.getAsPossible(`${this.getBasePath()}/${archiveFormat || 'tarball'}/${ref}`);
        }
    }

    angular.module('ngGitHubTools').service('$ghContentsService', ['$ghRequestService', ghContentsServiceClass]);
})();
