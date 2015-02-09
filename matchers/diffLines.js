/**
 * `diffLines` a custom Jasmine matcher that will output a coloured diff if the diffLines result is false.
 *
 * @example expect('one two three').diffLines('one three two');
 *
 */
var fs = require('fs'),
    path = require('path');

var config = require('../config');
var diffExpect = require('../diffUtil');

module.exports = {
    diffLines: function (expected) {
        if (expected === undefined) {
            console.error('diffLines() is missing a required parameter to compare to.');
        }

        var result = this.actual === expected;

        this.message = function () {
            var diffResult = '';

            if (!result) {
                diffResult = diffExpect.diffLines(this.actual, expected);
            }

            return diffExpect.constructDiffMessage(result, diffResult);
        };

        return result;
    },
    diffFileLines: function (expected) {
        if (expected === undefined) {
            console.error('diffFileLines() is missing a required parameter to compare to.');
        }

        var actualFilePath = path.resolve(__dirname, '..', config.basePath, this.actual);
        var expectedFilePath = path.resolve(__dirname, '..', config.basePath, expected);

        if (!fs.existsSync(expectedFilePath)) {
            console.error('diffFileLines() the filepath is missing', expectedFilePath);
        }

        if (!fs.existsSync(actualFilePath)) {
            console.error('diffFileLines() the filepath is missing', actualFilePath);
        }

        var actualContent = fs.readFileSync(actualFilePath, 'utf8');
        var expectedContent = fs.readFileSync(expectedFilePath, 'utf8');
        var result = actualContent === expectedContent;

        this.message = function () {
            var diffResult = '';
            if (!result) {
                diffResult = diffExpect.diffLines(actualContent, expectedContent);
            }
            return diffExpect.constructDiffMessage(result, diffResult);
        };

        return result;
    }
};