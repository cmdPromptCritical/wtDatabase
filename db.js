//Initializes a connection to postgres db

const { Pool, Client } = require('pg')

var pool = null;

try {
  pool = new Pool({
    user: 'wtdb',
    host: 'db', // change this to 'db' for docker, 'localhost' for standalone implementation
    database: 'wtdb',
    password: 'HgZwwYZZcC8vzr84',
    port: 5432, 
  });

  pool.query('SELECT NOW()', (err, res) => {
    try {
      console.log(res.rows[0]);
    } catch (error) {
      console.error(error);
    }

    if (err) {
      console.log('something went wrong when querying the db')
    }
  })
}
catch (err) {
  console.log(err);
}



module.exports = pool;
