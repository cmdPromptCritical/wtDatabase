/* Initializes a connection to elasticsearch. Settings changed for production,
   but you get the picture. */

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
   hosts: [ '192.168.2.32:9200']
});
client.ping({
  requestTimeout: 15000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('ElasticSearch connected');
  }
});

module.exports = client;
