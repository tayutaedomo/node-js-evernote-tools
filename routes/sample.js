'use strict';

const debug = require('debug')('node-js-evernote-tools:routes:sample');
const Evernote = require('evernote');

const config = require('../config');


const PAGE_PATH = '/sample';
const TITLE = 'Evernote Node.js Express Demo';


// home page
exports.index = function(req, res) {
  if (req.session.oauthAccessToken) {
    const token = req.session.oauthAccessToken;
    const client = new Evernote.Client({
      token: token,
      sandbox: config.SANDBOX,
      china: config.CHINA
    });
    client.getNoteStore().listNotebooks().then(function(notebooks) {
      req.session.notebooks = notebooks;
      res.render('sample/index', { title: TITLE, data: {} });
    }, function(error) {
      req.session.error = JSON.stringify(error);
      res.render('sample/index', { title: TITLE, data: {} });
    });
  } else {
    res.render('sample/index', { title: TITLE, data: {} });
  }
};

// OAuth
exports.oauth = function(req, res) {
  const client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });

  client.getRequestToken(config.AUTH_CALLBACK_URL, function(error, oauthToken, oauthTokenSecret, results) {
    if (error) {
      req.session.error = JSON.stringify(error);
      res.redirect(PAGE_PATH);
    } else {
      // store the tokens in the session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      // redirect the user to authorize the token
      res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });
};

// OAuth callback
exports.oauth_callback = function(req, res) {
  const client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX,
    china: config.CHINA
  });

  debug('oauth_callback', req.session.oauthToken, req.session.oauthTokenSecret);

  client.getAccessToken(
    req.session.oauthToken, 
    req.session.oauthTokenSecret, 
    req.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        console.log('error');
        console.log(error);
        res.redirect(PAGE_PATH);

      } else {
        debug('getAccessToken', oauthAccessToken, oauthAccessTokenSecret);

        // store the access token in the session
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        req.session.edamShard = results.edam_shard;
        req.session.edamUserId = results.edam_userId;
        req.session.edamExpires = results.edam_expires;
        req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
        req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
        res.redirect(PAGE_PATH);
      }
  });
};

// Clear session
exports.clear = function(req, res) {
  req.session.destroy();
  res.redirect(PAGE_PATH);
};

