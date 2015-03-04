'use strict';

app.factory('Offer', function($firebase, $q, FURL, Auth) {

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
        }
    };

    return Offer;

});
