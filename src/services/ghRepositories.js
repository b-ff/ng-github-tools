/**
 * Service for working with GitHub repositories API
 */

(() => {
    let _req;

    class ghRepositoriesServiceClass {
        constructor($ghRequestService) {
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
        getCurrentUserRepos() {
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
        getUserRepos(username) {
            return _req.getAsPossible(`users/${username}/repos`);
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
        getOrganizationRepos(orgName) {
            return _req.getAsPossible(`orgs/${orgName}/repos`);
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
        getAllPublicRepos() {
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
        createUserRepository(repositoryData) {
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
        createOrgRepository(organizationName, repositoryData) {
            return _req.sendAuthorized('POST', `orgs/${organizationName}/repos`, repositoryData);
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
        getRepository(ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}`);
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
        editRepository(ownerName, repositoryName, repositoryData) {
            return _req.sendAuthorized('PATCH', `repos/${ownerName}/${repositoryName}`, repositoryData);
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
        getRepoContributors(ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/contributors`);
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
        getRepoLanguages(ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/languages`);
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
        getRepoTeams(ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/teams`);
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
        getRepoTags(ownerName, repositoryName) {
            return _req.getAsPossible(`repos/${ownerName}/${repositoryName}/tags`);
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
        deleteRepository(ownerName, repositoryName) {
            return _req.sendAuthorized('DELETE', `repos/${ownerName}/${repositoryName}`);
        }
    }

    angular.module('ngGitHubTools')
        .service('$ghRepositoriesService', ['$ghRequestService', ghRepositoriesServiceClass]);
})();
