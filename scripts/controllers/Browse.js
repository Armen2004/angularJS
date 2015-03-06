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

        if($scope.signedIn()){

            //Check if the current user has already made an offer for selected task
            Offer.isOffered(task.$id).then(function(data){
                $scope.alreadyOffered = data;
            });
            $scope.isTaskCreator = Task.isCreator;

            $scope.isOpen = Task.isOpen;

            $scope.isAssignee = Task.isAssignee;

            $scope.isCompleted = Task.isCompleted;
        }

        $scope.comments = Comment.comment(task.$id);

        $scope.offers = Offer.offers(task.$id);

        $scope.block = false;

        $scope.isOfferMaker = Offer.isMaker;
    };

    $scope.cancelTask = function(taskID){
        Task.cancelTask(taskID).then(function(){
            toaster.pop('success', 'This task is canceled successfully.');
        },function(err) {
            toaster.pop('error','Oops! something went wrong.');
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
            toaster.pop('success','Comment added successfully.');
        },function(err) {
            toaster.pop('error','Oops! something went wrong.');
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
    };

    $scope.cancelOffer = function(offerID){
        Offer.cancelOffer($scope.selectedTask.$id, offerID).then(function(){
            toaster.pop('success', 'You offer has been canceled.');

            $scope.alreadyOffered = false;
            $scope.block = false;
        });
    };

    $scope.acceptOffer = function(offerID, runnerID){
        Offer.acceptOffer($scope.selectedTask.$id, offerID, runnerID).then(function(){
            toaster.pop('success', 'Offer is accepted.');
        });
    };

    $scope.completeTask = function(taskID){
        Task.completeTask(taskID).then(function(){
            toaster.pop('success', 'Congratulation! You have completed this task.');
        });
    }

});