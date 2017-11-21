import mongoose from 'mongoose';
import chalk from 'chalk';
const log = console.log;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/article', { useMongoClient: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => log(chalk.green(' √ [mongo-db] connected with collection articles successed')));
