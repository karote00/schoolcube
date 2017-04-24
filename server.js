'use strict';

const path = require('path');
const express = require('express');
const config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8081 : process.env.PORT;
const app = express();
const serve = (path, cache) => express.static(__dirname + path);

if (isDeveloping) {
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    // contentBase: 'src',
    // stats: {
    //   colors: true,
    //   hash: false,
    //   timings: true,
    //   chunks: false,
    //   chunkModules: false,
    //   modules: false
    // }
  });

	app.use(serve('/assets'));
  // app.use(serve('/build'));

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
		res.sendFile(path.join(__dirname, '/index.html'));
  });

  const server = app.listen(port, 'localhost', function onStart(err) {
    if (err) {
      console.log(err);
    }

    // const port = server.address().port;
    // console.log(`App listening on port ${port}`);
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });
} else {
  if (module === require.main) {
    // app.use(serve('/build'));
    app.get('*', function response(req, res) {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

    const server = app.listen(8081, 'localhost', function onStart(err) {
      if (err) {
        console.log(err);
      }

      console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    });
  }
}

module.exports = app;