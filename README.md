# ng-github-tools
AngularJS 1.* module for work with GitHub API

At this moment it can: 
* authorize your app (except 2-factor auth)
* send both authorized and unauthorized requests to GitHub API
* get list of all users, user specified by username, current user
* create, update and delete repositories
* get repository teams, contributors, tags, languages
* get branches for specified repository
* CRUD operations for files in repository

## Getting Started
* Install `ng-github-tools` via npm:
```sh
npm i ng-github-tools --save
```

* Load module to your source, for example like this (Webpack way):
```javascript
import 'ng-github-tools';
```
* Add `ngGithubTools` module as dependency to your app:
```javascript
angular.module('myApp', [
    'ngGitHubTools'
]);
```
* Use it on the way you want, for example:
```javascript
angular.module('myApp').controller('myAppController' ['$ghContentsService', function($ghContentsService) {
    var thisCtrl = this;
    
    // Get an archive download link for some repository
    $ghContentsService.setRepository('%username%', '%yourRepoName%').getArchiveLink('zipball').then(function(response) {
        thisCtrl.downloadLink = response.data;
    });
}]);
```

## Currently provided services

* `$ghBase64Service` – service for encoding data to base64 and decode it back
* `$ghRequestService` – service for sending requests to GitHub API server
* `$ghAuthService` – service for working with GitHub authorization API
* `$ghUsersService` – service for working with GitHub users API
* `$ghRepositoriesService` – service for working with GitHub repositories API
* `$ghBranchesService` – service for sending requests to GitHub API server
* `$ghContentsService` – service for working with GitHub users API

## Other

CONTRIBUTE.md and Wiki will be provided soon. 
If you interested in some not implemented features — feel free to contact me and we'll find solution.
