'use strict';

app.factory('Task', function($firebase, Auth, FURL) {
    var ref = new Firebase(FURL);
    var tasks = $firebase(ref.child('tasks')).$asArray();
    var user = Auth.user;

    var Task = {

        all : tasks,

        getTask : function(taskID){
            return $firebase(ref.child('tasks').child(taskID));
        },

        createTask : function(task){
            task.datetime = Firebase.ServerValue.TIMESTAMP;
            return tasks.$add(task).then(function(newTask){
                var obj = {
                    taskID: newTask.key(),
                    type: true,
                    title: task.title
                };
                $firebase(ref.child('user_tasks').child(task.poster)).$push(obj);
                return newTask;
            });
        },

        editTask : function(task){
            var t = this.getTask(task.$id);
            return t.$update({title : task.title, description : task.description, total : task.total});
        },

        cancelTask : function(taskID){
            var t = this.getTask(taskID);
            return t.$update({status : "canceled"});
        },

        isCreator : function(task){
            return (user && user.provider && user.uid === task.poster);
        },

        isOpen : function(task){
            return task.status === "open";
        },

        completeTask: function(taskID){
            var t = this.getTask(taskID);
            return t.$update({ status : "completed"});
        },

        isAssignee: function(task){
            return (user && user.provider && user.uid === task.runner);
        },

        isCompleted: function(task){
            return task.status === "completed";
        },

        createUserTask: function(taskID){
            Task.getTask(taskID).$asObject().$loaded().then(function(task){
               var obj = {
                   taskID: taskID,
                   type: false,
                   title: task.title
               };
                return $firebase(ref.child('user_tasks').child(task.runner)).$push(obj);
            });
        }

    };

    return Task;

});
