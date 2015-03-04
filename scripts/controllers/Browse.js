'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment, Offer) {

    $scope.searchTask = '';
    $scope.tasks = Task.all;
    $scope.signedIn = Auth.signedIn;
    $scope.listMode = true;

    $scope.user = Auth.user;

    if($routeParams.taskID){
        var task = Task.getTask($routeParams.taskID).$asObject();
        $scope.listMode = false;
        setSelectedTask(task);
    };

    function setSelectedTask(task){
        $scope.selectedTask = task;

        if($scope.signedIn){

            //Check if the current user has already made an offer for selected task
            Offer.isOffered(task.$id).then(function(data){
                $scope.selectedTask = data;
                console.log($scope.selectedTask);
            });
            $scope.isTaskCreator = Task.isCreator;
            $scope.isOpen = Task.isOpen;
        }

        $scope.comments = Comment.comment(task.$id);
        $scope.offers = Offer.offers(task.$id);
        $scope.block = false;
    };

    $scope.cancelTask = function(taskID){
        Task.cancelTask(taskID).then(function(){
            toaster.pop('success', 'This task is canceled successfully.');
        });
    };

    $scope.addComment = function(){
        var comment = {
            content : $scope.content,
            name : $scope.user.profile.name,
            gravatar : $scope.user.profile.gravatar
        };

        Comment.addComment($scope.selectedTask.$id, comment).then(function(){
            $scope.content = '';
        });
    };

    $scope.makeOffer = function(){
        var offer = {
            total: $scope.total,
            uid: $scope.user.uid,
            name : $scope.user.profile.name,
            gravatar : $scope.user.profile.gravatar
        };

        Offer.makeOffer($scope.selectedTask.$id, offer).then(function(){
            toaster.pop('success', 'You offer has been placed.');
            $scope.total = '';
            $scope.block = true;
            $scope.alreadyOffered = true;
        });
    }

});