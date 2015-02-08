/**
 * `diffChars` a custom Jasmine matcher that will output a coloured diff if the diffChars result is false.
 *
 * @example expect('one two three').diffChars('one three two');
 *
 */
var fs = require('fs'),
    path = require('path');

var diffExpect = require('../index');

module.exports = {
    diffChars: function (expected) {
        if (expected === undefined) {
            console.error('diffChars() is missing a required parameter to compare to.')
        }

        var result = this.actual === expected;

        this.message = function () {
            var diffResult = '';

            if (!result) {
                diffResult = diffExpect.diffChars(this.actual, expected);
            }

            return diffExpect.constructDiffMessage(diffResult);
        }

        return result;
    },
    diffFileChars: function (expected) {
        if (expected === undefined) {
            console.error('diffFileChars() is missing a required parameter to compare to.')
        }

        var actualFilePath = path.resolve(__dirname, '..', diffExpect.basePath, this.actual);
        var expectedFilePath = path.resolve(__dirname, '..', diffExpect.basePath, expected);

        if (!fs.existsSync(expectedFilePath)) {
            console.error('diffFileChars() the filepath is missing', expectedFilePath)
        }

        if (!fs.existsSync(actualFilePath)) {
            console.error('diffFileChars() the filepath is missing', actualFilePath)
        }

        var actualContent = fs.readFileSync(actualFilePath, 'utf8');
        var expectedContent = fs.readFileSync(expectedFilePath, 'utf8');
        var result = actualContent === expectedContent;

        this.message = function () {
            var diffResult = '';
            if (!result) {
                diffResult = diffExpect.diffChars(actualContent, expectedContent);
            }

            return diffExpect.constructDiffMessage(diffResult);
        }
        return result;
    }
}