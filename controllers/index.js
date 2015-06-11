'use strict';
var app =  require('../index');
var concur = require('concur-platform');
var couchbase = require('couchbase');
var myCluster = new couchbase.Cluster(app.kraken.get('couchbase:cluster'));

var IndexModel = require('../models/index');


module.exports = function (router) {

    var model = new IndexModel();


    router.get('/', function (req, res) {


        res.render('index', model);


    });
    router.get('/concur', function (req, res) {

        var options = {
            oauthToken: app.kraken.get('concur:oauthToken')
        };

        concur.user.get(options)
            .then(function(data) {
                var myBucket = myCluster.openBucket('test_concur');
                myBucket.insert("test"+(new Date()).getTime(), data, function(err, res1) {
                    if (err) {
                        console.log('operation failed', err);
                        /*
                         operation failed { [Error: The key does not exist on the server] code: 13 }
                         */
                        return;
                    }

                    console.log('success!', res1);
                });
                res.end(JSON.stringify(data, null, 4));

            })
            .fail(function(error) {
                // Error will contain the error returned.
                res.end( JSON.stringify(error, null, 4));
            });

       // res.end(output);


    });
};
