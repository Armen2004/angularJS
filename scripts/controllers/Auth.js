'use strict';

app.controller('AuthController', function($scope, $location, Auth, toaster){

    if(Auth.signedIn()){
        $location.path('/');
    }

    $scope.register = function(user){
        Auth.register(user).then(function(){
            toaster.pop('success', 'Register Successfully!');
            //console.log("Register Successfully!");
            $location.path('/')
        }, function(error){
            toaster.pop('error', 'Oops, something went wrong!', error.toString());
            //console.log("Error ... !", error);
        });
    };

    $scope.login = function(user){
        Auth.login(user).then(function(){
            toaster.pop('success', 'Logged in Successfully!');
            //console.log("Logged in Successfully!");
            $location.path("/");
        }, function(error){
            toaster.pop('error', 'Oops, something went wrong!', error.toString());
            //console.log("Error ... !", error);
        });
    };

    $scope.changePassword = function(user){
        Auth.changePassword(user).then(function(){

            //Reset form
            $scope.user.email = '';
            $scope.user.oldPass = '';
            $scope.user.newPass = '';
            toaster.pop('success', 'Password changed successfully !');
            //console.log("Password changed successfully !");
        }, function(error){
            toaster.pop('error', 'Oops, something went wrong!', error.toString());
            //console.log("Error ... !", error);
        });
    }

});
