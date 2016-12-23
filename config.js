/**
 * Created by ADDY on 02/12/16.
 */
var fs = require('file-system');
var configPath = '/Users/ADDY/keys/config.json'; // private local directory
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig=  parsed;