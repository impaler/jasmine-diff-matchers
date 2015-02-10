/**
 * `diffPatch` .
 *
 * @example expect('one two three').diffChars('one three two');
 *
 */
var fs = require('fs'),
    path = require('path');

var config = require('../config');
var diffExpect = require('../diffUtil');

module.exports = {
    diffPatch: function (expected) {
        if (expected === undefined) {
            console.error('diffPatch() is missing a required parameter to compare to.');
        }

        var result = (this.actual === expected);

        if (!result) {
            this.message = function () {
                return diffExpect.diffPatch(this.actual, expected);
            };
        }

        return result;
    },
    diffFilePatch: function (expected) {
        if (expected === undefined) {
            console.error('diffFilePatch() is missing a required parameter to compare to.');
        }

        var actualFilePath = this.actual,
            expectedFilePath = expected;

        if(!fs.existsSync(actualFilePath)) {
            actualFilePath = path.resolve(__dirname, '..', config.basePath, actualFilePath);

            if(!fs.existsSync(actualFilePath)) {
                console.error('diffFilePatch() the actualFilePath is does not exist', actualFilePath);
                console.error('tried to used the config.basePath', config.basePath, 'with no success', actualFilePath);
            }
        }

        if(!fs.existsSync(expectedFilePath)) {
            expectedFilePath = path.resolve(__dirname, '..', config.basePath, expectedFilePath);

            if(!fs.existsSync(expectedFilePath)) {
                console.error('diffFilePatch() the expectedFilePath is does not exist', expectedFilePath);
                console.error('tried to used the config.basePath', config.basePath, 'with no success', expectedFilePath);
            }
        }

        var actualContent = fs.readFileSync(String(actualFilePath), 'utf8') + '\n';
        var expectedContent = fs.readFileSync(String(expectedFilePath), 'utf8') + '\n';

        var result = (actualContent === expectedContent);

        if (!result) {
            this.message = function () {
                return diffExpect.diffPatch(actualContent, expectedContent);
            };
        }

        return result;
    }
};