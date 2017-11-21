import mysql from 'mysql';
import chalk from 'chalk';
const log = console.log;

const connect = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'be_posts'
});

connect.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  log(chalk.green(' √ [mysql-db] connected with database be_posts successed'));
});

// // connect.query('SELECT * from fk_post', function (error, results, fields) {
// //   if (error) {
// //     console.log(error);
// //     throw error;
// //   }
// //   console.log('The solution is: ', results);
// // });
//
// connect.end();
