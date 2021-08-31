/* Initializes a connection to elasticsearch. Settings changed for production,
   but you get the picture. */

// var elasticsearch = require('elasticsearch');
// var client = new elasticsearch.Client({
//    hosts: [ '192.168.2.32:9200']
// });
// client.ping({
//   requestTimeout: 15000,
// }, function (error) {
//   if (error) {
//     console.error('elasticsearch cluster is down!');
//   } else {
//     console.log('ElasticSearch connected');
//   }
// });

// module.exports = client;

// new postgres-based connection
const { Pool, Client } = require('pg')

var pool = null;

try {
  pool = new Pool({
    user: 'wtdb',
    host: 'localhost', //'192.168.2.11', //'74.14.8.225',
    database: 'wtdb',
    password: '25YaDfAYHSBvFcpk',
    port: 5432, //stock option was 3211
  });

  pool.query('SELECT NOW()', (err, res) => {
    console.log(res.rows[0])
    if (err) {
      console.log('something went wrong when querying the db')
    }
  })
}
catch (err) {
  console.log(err);
}



module.exports = pool;
