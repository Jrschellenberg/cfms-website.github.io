/* Express App */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import customLogger from '../utils/logger';
import Utils from '../utils/Utils';
import router from '../routes/';

const expressSanitizer = require('express-sanitizer');

/* My express App */
export default function expressApp() {
  const app = express();

  // Apply express middlewares
  app.use(cors(Utils.getCorsOptions()));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(expressSanitizer());

  // gzip responses
  app.use(compression());

  // Attach logger
  app.use(morgan(customLogger));
  
  // Setup routes
  app.use(router);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  //Handle Error here.
  app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    console.error('error is ', err);
    const status = err.status || 500;
    return res.json({ success: false, status: status, message: err.message });
  });

  return app;
}
