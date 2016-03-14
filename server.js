/*-------------------------------------------------------------------------------------------------------------------*\
|  Copyright (C) 2016 dejanglozic.com
|  Modified from the original react-engine example by PayPal (see react-engine for details)                           |
|                                                                                                                     |
|  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance     |
|  with the License.                                                                                                  |
|                                                                                                                     |
|  You may obtain a copy of the License at                                                                            |
|                                                                                                                     |
|       http://www.apache.org/licenses/LICENSE-2.0                                                                    |
|                                                                                                                     |
|  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed   |
|  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for  |
|  the specific language governing permissions and limitations under the License.                                     |
\*-------------------------------------------------------------------------------------------------------------------*/

'use strict';

const PORT = process.env.PORT || 3000;

import {join} from 'path';
import express from 'express';
import ReactEngine from 'react-engine';
import items from './items.json';
import routes from './public/routes.jsx';

let app = express();

// create the view engine with `react-engine`
let engine = ReactEngine.server.create({
  routes: routes,
  routesFilePath: join(__dirname, '/public/routes.jsx'),
  performanceCollector: function(stats) {
    console.log(stats);
  }
});

// set the engine
app.engine('.jsx', engine);

// set the view directory
app.set('views', join(__dirname, '/public/views'));

// set jsx as the view engine
app.set('view engine', 'jsx');

// finally, set the custom view
app.set('view', ReactEngine.expressView);

// expose public folder as static assets
app.use(express.static(join(__dirname, '/public')));

app.get('/api/items', function(req, res) {
  setTimeout(function() {
    res.json(items);
    setTimeout(function() {
      emitStatus(items);
    }, 1000);
  }, 1000);
});

// add our app routes
app.get('*', function(req, res) {
  res.render(req.url, {});
});

app.use(function(err, req, res, next) {
  console.error(err);

  // http://expressjs.com/en/guide/error-handling.html
  if (res.headersSent) {
    return next(err);
  }

  if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_REDIRECT) {
    return res.redirect(302, err.redirectLocation);
  }
  else if (err._type && err._type === ReactEngine.reactRouterServerErrors.MATCH_NOT_FOUND) {
    return res.status(404).send('Route Not Found!');
  }
  else {
    // for ReactEngine.reactRouterServerErrors.MATCH_INTERNAL_ERROR or
    // any other error we just send the error message back
    return res.status(500).send(err.message);
  }
});

const server = app.listen(PORT, function() {
  console.log('Example app listening at port %s', PORT);
});

var io = require('socket.io')(server);

function emitStatus(items) {
  var status = [];
  for (var i in items) {
    var item = items[i];
    var s = {};
    s.status = (Math.random()<.5)?"active":"error";
    s.id = item.id;
    setTimeout(function(status) {
      io.emit("status", [status]);
    }, (Math.floor((Math.random() * 900) + 100)), s);
  }
}

