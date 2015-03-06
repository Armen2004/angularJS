'use strict';

app.factory('Offer', function($firebase, $q, FURL, Auth, Task) {

    var ref = new Firebase(FURL);
    var user = Auth.user;

    var Offer = {

        offers: function(taskID){
            return $firebase(ref.child('offers').child(taskID)).$asArray();
        },

        makeOffer: function(taskID, offer){
            var task_offer = this.offers(taskID);

            if(task_offer){
                return task_offer.$add(offer);
            }
        },

        isOffered: function(taskID){
            if(user && user.provider){
                var d = $q.defer();

                $firebase(ref.child('offers').child(taskID).orderByChild('uid')
                    .equalTo(user.uid))
                    .$asArray()
                    .$loaded().then(function(data){
                    d.resolve(data.length > 0);
                }, function(){
                    d.reject(false);
                });
                return d.promise;
            }
        },

        isMaker: function(offer){
            return(user && user.provider && user.uid === offer.uid);
        },

        getOffer: function(taskID, offerID){
            return $firebase(ref.child('offers').child(taskID).child(offerID));
        },

        cancelOffer: function(taskID, offerID){
            return this.getOffer(taskID, offerID).$remove();
        },

        acceptOffer: function(taskID, offerID, runnerID){
            var o = this.getOffer(taskID, offerID);
            return o.$update({accepted : true}).then(function(){
                var t = Task.getTask(taskID);
                return t.$update({status : 'assigned', runner : runnerID});
            }).then(function(){
                return Task.createUserTask(taskID);
            });
        }
    };

    return Offer;

});
