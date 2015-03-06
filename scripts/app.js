'use strict';

var app = angular.module('TaskNinjaApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'firebase',
    'toaster',
    'angularMoment'
    ])
    .constant('FURL', 'https://armen-hovasapyan.firebaseio.com/')
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    }])
    .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/browse.html',
        controller : 'BrowseController'
      })
      //.when('/', {
      //  templateUrl: 'views/main.html'
      //})
      //.when('/post', {
      //  templateUrl: 'views/post.html',
      //  controller : 'TaskController'
      //})
      //.when('/edit/:taskId', {
      //  templateUrl: 'views/edit.html',
      //  controller : 'TaskController'
      //})
      //.when('/browse', {
      //  templateUrl: 'views/browse.html',
      //  controller : 'TaskController'
      //})
        .when('/browse/:taskID', {
        templateUrl: 'views/browse.html',
        controller : 'BrowseController'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller : 'AuthController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller : 'AuthController'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller : 'DashboardController',
        resolve: {
            currentAuth: function(Auth){
                return Auth.requireAuth();
            }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
});
