var mongo = require('mongodb'),
	Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {safe: true});
db = new Db('winedb', server);

db.open(function(err, ob){
	if(!err){
		console.log('Connected to wine_db database');
		db.collection('wines', {safe: true}, function(err, collection){
			if(err){
				console.log('Wines collection does not exist. Populating from sample data..');
				populate_db();
			}
		});
	}
});

exports.index = function(req, res){
	db.collection('wines', function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items);
		});
	});
};

exports.create = function(req, res){
	var wine = req.body;
	console.log('req.body is ');
	console.log(req.body);
	console.log('Adding wine: ' + JSON.stringify(wine));
	db.collection('wines', function(err, collection){
		collection.insert(wine, {safe:true}, function(err, result){
			if(err){
				console.log('error: An error has occurred');
			} else {
				console.log('Success: '+ JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.read = function(req, res){
	var id = req.params.id;
	console.log('Reading wine by id: '+ id);
	db.collection('wines', function(err, collection){
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item){
			console.log(JSON.stringify(item));
			res.send(item);
		});
	});
};

exports.update = function(req, res){
	var id = req.params.id;
	var wine = req.body;
	console.log('Updating wine by id: '+ id);
	console.log(JSON.stringify(wine));
	db.collection('wines', function(err, collection){
		collection.update({'_id': new BSON.ObjectID(id)}, wine, {safe: true}, function(err, result){
			if(err){
				console.log("error updating wine: "+ err);
				res.send({'error': 'An error has occurred'});
			} else {
				console.log('updated wine '+ id);
				res.send(wine);
			}
		});
	});
};

exports.delete = function(req, res){
	var id = req.params.id;
	console.log('deleting wine '+ id);
	db.collection('wines', function(err, collection){
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe: true}, function(err, result){
			if(err){
				console.log('error deleting wine '+ id);
				res.send({'error':'an error has occurred'});
			} else {
				console.log('deleted wine '+ id);
				res.send(req.body);
			}
		});
	});
};

var populate_db = function() {
	console.log('running db seed function');
    var wines = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });
};








