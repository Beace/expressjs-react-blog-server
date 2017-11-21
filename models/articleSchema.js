import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const filter = { __v: 0 };
const articleSchema = new Schema(
  {
    abstract: String,
    title: String,
    content: String,
    date: Date,
    author: String,
     __v: { type: Number, select: false }
  },
  { collection: 'articles' }
);

articleSchema.statics.findArticles = function() {
  return this.find().exec();
};

articleSchema.statics.findArticleById = function(id) {
  return this.findById(id, filter).exec();
};

articleSchema.statics.findArticlesByAuthor = function(author) {
  return this.find({ author }).exec();
};

const ArticlesModal = mongoose.model('ArticlesModal', articleSchema);

export default ArticlesModal;
