'use strict';

const debug = require('debug')('node-js-evernote-tools:routes:api');
const express = require('express');
const router = express.Router();
const Evernote = require('evernote');

const config = require('../config');


router.get('/notebooks/query', function(req, res, next) {
  const payload = {
    title: 'Notebooks Query',
    data: { params: {} }
  };

  debug('/notebooks/query', payload);

  res.render('api/notebooks/query', payload);
});

router.post('/notebooks/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Notebooks Query',
    data: { params: params }
  };

  const client = new Evernote.Client({
    token: params.token,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });

  client.getNoteStore().listNotebooks().then(function(notebooks) {
    payload.data.result = JSON.stringify(notebooks, null, 2);
    res.render('api/notebooks/query', payload);

  }, function(err) {
    console.error(err);

    payload.data.error = JSON.stringify(err, null, 2);
    res.render('api/notebooks/query', payload);
  });
});


module.exports = router;

