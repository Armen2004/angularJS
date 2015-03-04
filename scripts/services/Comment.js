'use strict';

app.factory('Comment', function($firebase, FURL) {

    var ref = new Firebase(FURL);
    var Comment = {

        comment: function(taskID){
            return $firebase(ref.child('comments').child(taskID)).$asArray();
        },

        addComment: function(taskID, comment){
            var task_comment = this.comment(taskID);
            comment.datetime = Firebase.ServerValue.TIMESTAMP;

            if(task_comment) {
                return task_comment.$add(comment);
            }
        }
    };

    return Comment;

});
