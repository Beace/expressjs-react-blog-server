import marked from 'marked';
import highlightjs from 'highlight.js';
import ArticlesModal from './models/articleSchema';
const { wrap: async } = require('co');

/* eslint-disable no-console */

function errorHandler(err, res) {
  res.json({
    msg: err,
    code: -1,
  });
}

const routes = app => {
  // allow custom header and CORS
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
  });

  /**
   * Find all articles
   * @param  {[type]} '/api/articles' [description]
   * @param  {[type]} (req,           res)          [description]
   * @return {[json]}                 [json data]
   */
  app.get('/api/articles', (req, res) => {
    ArticlesModal.findArticles()
      .then(data => {
        res.json({
          data: data || [],
          code: 0,
        });
      })
      .catch(err => errorHandler(err, res));
  });

  /**
   * Find article by objectid left the async function type for more infomation
   * @param  {[type]} '/api/article/:id' [description]
   * @param  {[type]} (req,               res           [description]
   * @return {[json]}                     [json data]
   */
  app.get('/api/article/:id', async(function* (req, res) {
    const id = req.params.id;
    try {
      const article = yield ArticlesModal.findArticleById(id);
      const articleHTML = article;
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight(code) {
          return highlightjs.highlightAuto(code).value;
        },
      });
      articleHTML.content = marked(article.content);
      res.json({
        data: articleHTML,
        code: 0,
      });
    } catch (error) {
      errorHandler(error, res);
    }
  }));

  /**
   * Article for search by author e.g Beace
   * @param  {[type]} '/api/articles/search?author=Beace' [description]
   * @param  {[type]} (req,                  res           [description]
   * @return {[json]}                        [json data]
   */
  app.get('/api/articles/search', (req, res) => {
    const author = req.query.author;
    ArticlesModal.findArticlesByAuthor(author)
      .then(data => {
        res.json({
          data: data || [],
          code: 0,
        });
      })
      .catch(error => errorHandler(error, res));
  });
};

export default routes;
