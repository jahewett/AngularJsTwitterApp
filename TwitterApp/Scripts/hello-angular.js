var ngTwitter = angular.module("ngTwitter", ["ngResource", "ngRoute"]);

ngTwitter.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "timeline",
        controller: "TimelineController"
    });
});

ngTwitter.controller("TimelineController", function ($scope, $http, TwitterService) {
    $scope.tweets = TwitterService.timeline.query({}, isArray = true);

    $scope.sendStatus = function () {
        var tweetText = $scope.statusText;

        var newTimeLine = new TwitterService.timeline(
        {
            tweet: tweetText
        });

        newTimeLine.$save(function (data, headers) {
            if (data.success && data.success == true) {
                alert("Tweet sent successfully");
                $scope.statusText = "";
            }
            else {
                alert("Error: " + data.errorMessage);
            }
        });
    }

    $scope.newTweets = {
        "0": "No new tweets",
        "other": "{} new tweets"
    };

    $scope.retweet = function (item) {
        var resultPromise = $http.post("/Home/Retweet/", item);

        resultPromise.success(function (data) {
            if (data.success) {
                alert("Retweeted successfully");
            }
            else {
                alert("ERROR: Retweeted failed! " + data.errorMessage);
            }
        });
    }
});

ngTwitter.factory("TwitterService", function ($resource) {
    return {
        timeline: $resource("/Home/Tweet")
    };
});

ngTwitter.directive("retweetButton", function () {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scopr: {
            text: "@",
            clickevent: "&"
        },
        template: "<button class='btn btn-xs' ng-click='clickevent()'><span class='glyphicon glyphicon-retweet'></span>{{text}}</button>"
    }
});