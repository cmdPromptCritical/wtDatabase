/* Initializes a connection to elasticsearch. Settings changed for production,
   but you get the picture. */

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
   hosts: [ 'http://onkalo.ddns.net:9200']
});
client.ping({
  requestTimeout: 5000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
