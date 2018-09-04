'use strict';

const debug = require('debug')('node-js-evernote-tools:routes:api');
const express = require('express');
const router = express.Router();
const Evernote = require('evernote');

const config = require('../config');


router.get('/notebooks/query', function(req, res, next) {
  res.render('api/notebooks/query', {
    title: 'Notebooks Query',
    data: { params: {} }
  });
});

router.post('/notebooks/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Notebooks Query',
    data: { params: params }
  };

  const client = createEvernoteClient(params.token);

  client.getNoteStore().listNotebooks().then(function(notebooks) {
    payload.data.result = JSON.stringify(notebooks, null, 2);

  }).catch(function(err) {
    console.error(err);
    payload.data.error = JSON.stringify(err, null, 2);

  }).then(function() {
    res.render('api/notebooks/query', payload);
  });
});


router.get('/notes/query', function(req, res, next) {
  res.render('api/notes/query', {
    title: 'Notes Query',
    data: { params: {} }
  });
});

router.post('/notes/query', function(req, res, next) {
  const params = req.body;
  const payload =  {
    title: 'Notes Query',
    data: { params: params }
  };

  const client = createEvernoteClient(params.token);
  const store = client.getNoteStore();
  const filter = new Evernote.NoteStore.NoteFilter({
    //words: ['one', 'two', 'three'],
    //ascending: true
  });
  const spec = new Evernote.NoteStore.NotesMetadataResultSpec({
    includeTitle: true,
    // includeContentLength: true,
    // includeCreated: true,
    // includeUpdated: true,
    // includeDeleted: true,
    // includeUpdateSequenceNum: true,
    // includeNotebookGuid: true,
    // includeTagGuids: true,
    //includeAttributes: true,
    // includeLargestResourceMime: true,
    // includeLargestResourceSize: true,
  });

  store.findNotesMetadata(filter, 0, 10, spec).then(function(notes) {
    payload.data.result = JSON.stringify(notes, null, 2);

  }).catch(function(err) {
    payload.data.error = JSON.stringify(err, null, 2);

  }).then(function() {
    res.render('api/notes/query', payload);
  });
});


function createEvernoteClient(token) {
  return new Evernote.Client({
    token: token,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });
}

module.exports = router;

