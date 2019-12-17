/**
 * Module dependencies.
 */
var util = require("util"),
  _ = require("underscore"),
  Profile = require("./profile"),
  OAuth2Strategy = require("passport-oauth2"),
  InternalOAuthError = require("passport-oauth2").InternalOAuthError;

/**
 * `Strategy` constructor
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL =
    options.authorizationURL ||
    "https://oauth.youngstargram.com/oauth2/authorize";
  options.tokenURL =
    options.tokenURL || "https://oauth.youngstargram.com/oauth2/token";

  OAuth2Strategy.call(this, options, verify);
  this.name = "youngstargram";

  this._profileURL =
    options.profileURL || "https://oauth.youngstargram.com/api/profile";
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
  var params = _.extend({}, options);
  params["response_type"] = "code";

  return params;
};

/**
 * Retrieve user profile from Youngstargram.
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(true);

  // User profile API
  this._oauth2.get(this._profileURL, accessToken, function(err, body, res) {
    if (err) {
      return done(new InternalOAuthError("Failed to fetch user profile.", err));
    }

    // parse the response to JSON object
    var parsed = null;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      return done(new InternalOAuthError("Failed to parse the response.", err));
    }

    // set profile object
    var profile = Profile.parse(parsed);
    profile.provider = "youngstargram";
    profile._raw = body;
    profile._json = parsed;

    done(null, profile);
  });
};

/**
 * Expose  `Strategy`.
 */
module.exports = Strategy;
