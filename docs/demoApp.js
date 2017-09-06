(function() {
    function DemoController ($ghUsersService, $ghRepositoriesService) {
        const $ctrl = this;

        $ctrl.user = {}
        $ctrl.username = '';
        $ctrl.repositoriesList = []

        function handleRepositoriesList (response) {
            $ctrl.repositoriesList = response.data;
        }

        function getRepositoriesList () {
            $ghRepositoriesService.getUserRepos($ctrl.username).then(handleRepositoriesList);
        }

        function handleUserInfo (response) {
            $ctrl.user = response.data;
        }

        function getUserInfo () {
            $ghUsersService.getUserByUsername($ctrl.username).then(handleUserInfo);
        }

        $ctrl.getRepositoriesList = getRepositoriesList;
        $ctrl.getUserInfo = getUserInfo;
    }

    angular.module('DemoApp', ['ngGitHubTools']).controller('DemoController', DemoController);
})();

