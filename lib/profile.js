/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if (typeof json === "string") {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = json.id;
  profile.displayName = json.username;
  profile.name = json.name;
  profile.emails = [{ value: json.email }];
  if (json.profileImage) {
    profile.photos = [{ value: json.profileImage }];
  }

  return profile;
};
