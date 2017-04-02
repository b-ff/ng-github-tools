/**
 * Service for working with GitHub contents
 */

(() => {
    let _req;

    class ghContentsServiceClass {
        constructor($ghRequestService) {
            _req = $ghRequestService;
            this.username = '';
            this.repositoryName = '';
        }

        setRepository(username, repositoryName) {
            this.username = username;
            this.repositoryName = repositoryName;
            return this;
        }

        getBasePath() {
            return `repos/${this.username}/${this.repositoryName}`;
        }

        getReadme() {
            return _req.getAsPossible(`${this.getBasePath()}/readme`);
        }

        getContents(path, ref) {
            return _req.getAsPossible(`${this.getBasePath()}/contents/${path}`, (ref) ? { ref } : {});
        }

        createFile(path, message, content, committer, author, branch) {
            const params = {
                message,
                content
            };

            if (committer) params.committer = committer;
            if (author) params.author = author;
            if (branch) params.branch = branch;

            return _req.put(`${this.getBasePath()}/contents/${path}`, params);
        }

        updateFile(path, message, content, sha, committer, author, branch) {
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

        deleteFile(path, message, content, sha, committer, author, branch) {
            const params = {
                message,
                content,
                sha
            };

            if (committer) params.committer = committer;
            if (author) params.author = author;
            if (branch) params.branch = branch;

            return _req.delete(`${this.getBasePath()}/contents/${path}`, params);
        }

        getArchiveLink(archive_format, ref) {
            return _req.getAsPossible(`${this.getBasePath()}/${archive_format || 'tarball'}/${ref}`);
        }
    }

    angular.module('ngGitHubTools').service('$ghContentsService', ['$ghRequestService', ghContentsServiceClass]);

})();
