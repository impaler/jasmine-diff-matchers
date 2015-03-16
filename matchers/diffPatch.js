/**
 * `diffPatch` .
 *
 * @example expect('one two three').diffChars('one three two');
 *
 */
var fs       = require('fs'),
    path     = require('path'),
    isstring = require('lodash.isstring');

var config     = require('../config'),
    diffExpect = require('../diffUtil');

module.exports = {

    /**
     * Jasmine 2 matcher that performs difference on the given strings
     * @returns {{compare: Function}}
     */
    diffPatch    : function () {
        return {
            compare: function (actual, expected) {
                var pass;
                var message = [actual, expected].map(function (value, i) {
                        return !isstring(value) && ('value "' + (i ? 'expected' : 'actual') + '" must be a string');
                    })
                    .filter(Boolean)
                    .join(', ');
                if (message) {
                    pass    = false;
                } else {
                    pass    = (actual === expected);
                    message = diffExpect.diffPatch(this.actual, expected);
                }
                return {
                    pass   : pass,
                    message: message
                };
            }
        }
    },

    /**
     * Jasmine 2 matcher that performs file difference on the given file names
     * @returns {{compare: Function}}
     */
    diffFilePatch: function () {
        /**
         * Attempt to load the given file path
         * @param {string|Array.<string>} filePath The path to attempt load
         * @returns {string|Buffer} The file buffer on success or a string on failure
         */
        function findFile(filePath) {
            var joined  = [].concat(filePath)
                .filter(isstring)
                .join(path.sep);
            var usePath  = [joined, [__dirname, '..', config.basePath, joined]]
                .map(function resolve(elements, i) {
                    return path.resolve.apply(path, [].concat(elements));
                })
                .filter(fs.existsSync)
                .pop();
            if (usePath) {
                return fs.readFileSync(usePath);
            } else {
                return ['file does not exist', joined, '(tried to used the config.basePath', config.basePath,
                    'with no success)'].join(' ');
            }
        }
        function isFirstOccurance(value, i, array) {
            return (array.indexOf(value) === i);
        }
        return {
            compare: function (actual, expected) {
                var actualFile   = findFile(actual),
                    expectedFile = findFile(expected);
                var pass;
                var message = [actualFile,expectedFile]
                    .filter(isstring)
                    .filter(isFirstOccurance)
                    .join(', ');
                if (message) {
                    pass    = false;
                } else {
                    var actualContent   = actualFile.toString();
                    var expectedContent = expectedFile.toString();
                    pass    = (actualContent === expectedContent);
                    message = pass ? 'Files are matching' : diffExpect.diffPatch(actualContent, expectedContent);
                }
                return {
                    pass   : pass,
                    message: message
                };
            }
        }
    }
};