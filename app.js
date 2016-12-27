
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http'),
  path = require('path'),
  Client=require('node-rest-client').Client,
  Cloudant = require('cloudant'),
  request = require('request'),
  helmet = require('helmet')
;

var db2;
var hasConnect = false;


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//var cfenv = require('cfenv');

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['dashDB']) {
        hasConnect = true;
		db2 = env['dashDB'][0].credentials;
	}
	
}


app.get('/', routes.index);

app.get('/users', user.list);

app.get('/ws/dataingestresp',function(req,res,next){
	   var resp=req.param('trandata');
       console.log("Service called::  " +resp);
       res.end(JSON.stringify({"data" :"This is a test"}));
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
