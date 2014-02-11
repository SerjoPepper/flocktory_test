define(['angular', 'underscore', 'app/canvas'], function (angular, _, canvas) {
    var phonecatApp = angular.module('flocktoryApp', []);
    phonecatApp.controller('CampaignCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.campaigns = [];
        $scope.selectedCampaigns = [];
        $http.get('data/campaigns.json').success(function(data) {
            $scope.campaigns = data;
        });
        $scope.filter = function () {
            return function (item) {
                var title = item.title.toLowerCase();
                var query = $scope.query && $scope.query.toLowerCase();
                return !item.selected && (!$scope.query || title.indexOf(query) !== -1);
            };
        };
        $scope.selectCampaign = function (campaign) {
            if ($scope.selectedCampaigns.length < 8) {
                campaign.selected = true;
                $scope.selectedCampaigns.push(campaign);
            }
        };
        $scope.deselectCampaign = function (campaign) {
            campaign.selected = false;
            $scope.selectedCampaigns = _.filter($scope.selectedCampaigns, function (campaign) {
                return campaign.selected === true;
            });
        };
        $scope.$watchCollection('selectedCampaigns', function () {
            canvas.render($scope.selectedCampaigns);
        })
    }]);
});