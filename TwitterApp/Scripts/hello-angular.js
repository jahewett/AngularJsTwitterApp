var ngTwitter = angular.module("ngTwitter", ["ngResource", "ngRoute"]);

ngTwitter.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "timeline",
        controller: "TimelineController"
    }).when(
        "/status/:id", {
            templateUrl: "status",
            controller: "TimelineController"
        }
    );
});

ngTwitter.factory("TwitterService", function ($resource, $http) {
    return {
        timeline: $resource("/Home/Tweet"),
        status: function (id) {
            return $http.get("/Home/Status/" + id);
        }
    };
});

ngTwitter.directive("retweetButton", function ($http, $routeParams) {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        controller: function ($scope, $element) {
            $element.on("click", function () {
                var resultPromise = $http.post("/Home/Retweet/", $scope.status);

                resultPromise.success(function (data) {
                    if (data.success) {
                        alert("Retweeted successfully");
                    } else {
                        alert("ERROR: Retweeted failed! " + data.errorMessage);
                    }
                });
            });
        },
        template: "<button class='btn btn-mini' ng-transclude><i class='icon-retweet'></i></button>"
    };
});

ngTwitter.controller("TimelineController", function ($scope, $http, $routeParams, TwitterService) {
    if ($routeParams.id) {
        var statusPromise = TwitterService.status($routeParams.id);
        statusPromise.success(function (data) {
            $scope.status = data;
        });
    } else {
        $scope.tweets = TwitterService.timeline.query({}, isArray = true);
    }

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
            } else {
                alert("Error: " + data.errorMessage);
            }
        });
    };

    $scope.newTweets = {
        "0": "No new tweets",
        "other": "{} new tweets"
    };
});

ngTwitter.controller("StatusController", function ($scope, $http, $routeParams, TwitterService) {
    var resultPromise = $http.get("/Home/Status/" + $routeParams.id);

    resultPromise.success(function (data) {
        $scope.status = data;
    });
});