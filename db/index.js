import mongoose from 'mongoose';
import colors from 'colors';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/article', { useMongoClient: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(colors.green('[db] connected width collection articles successed')));
