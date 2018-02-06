import marked from 'marked';
import highlightjs from 'highlight.js';
import ArticlesModal from './models/articleSchema';
// const { wrap: async } = require('co');
import { wrap as async } from 'co';

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


  app.get('/api/posts', (req, res) => {
    const { start, count = 5 } = req.query;
    if (!start) {
      res.json({
        msg: 'the start field is required',
        code: -1,
      });
    } else {
      sql.query(`SELECT * FROM fk_post LIMIT ${count} OFFSET ${start}`, function (error, results, fields) {
        if (error) errorHandler(error, res);
        res.json({
          data: results,
          code: 0
        });
      });
    }
  })

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

  app.post('/api/articles', (req, res) => {
    const article = new ArticlesModal(req.query);
    const count = 1;
    const start = 62;
    sql.query(`SELECT * FROM fk_post LIMIT ${count} OFFSET ${start}`, function (error, results, fields) {

      if (error) errorHandler(error, res);

      for (let i = 0; i < results.length; i++) {
        const a = new ArticlesModal({
          abstract: results[i].title,
          title: results[i].title,
          content: results[i].markdown_content,
          date: results[i].update_time,
        });
        a.save().then(data => {
          console.log(data);
        });
      }
      article.save().then(data => {
        res.json({
          code: 0,
          data,
        })
      }).catch(error => errorHandler(err, res));
    });
  });
};

export default routes;
