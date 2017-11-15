import mongoose from 'mongoose';

const ArticlesSchema = mongoose.Schema(
  {
    abstract: String,
    title: String,
    content: String,
    date: Date,
    author: String,
  },
  { collection: 'articles' }
);

// const Autor = mongoose.Schema({
//   author: String,
// });

ArticlesSchema.statics.findArticles = function() {
  return this.find().exec();
};

ArticlesSchema.statics.findArticleById = function(id) {
  return this.findById(id).exec();
};

ArticlesSchema.statics.findArticlesByAuthor = function(author) {
  return this.find({ author }).exec();
};

const ArticlesModal = mongoose.model('ArticlesModal', ArticlesSchema);

export default ArticlesModal;
