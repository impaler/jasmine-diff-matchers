var diff = require('diff'),
    fs = require('fs'),
    path = require('path'),
    colors = require('colors');

var addedColor = 'green';
var deletionsColor = 'red';
var sameColor = 'white';

// The project base path given to read location of the files to compare.
var basePath = 'example';

module.exports = {
    basePath: basePath,
    addedColor: addedColor,
    deletionsColor: deletionsColor,
    sameColor: sameColor,
    constructDiffMessage: constructDiffMessage,
    diffChars: diffChars,
    diffLines: diffLines,
    diffPatch: diffPatch
}

/**
 * Resolve the color of a diff result part
 * @param diffPart
 * @returns {string}
 */
function resolveColor(diffPart) {
    return diffPart.added ? addedColor :
        diffPart.removed ? deletionsColor : sameColor;
}

/**
 * Setup a generic diff result message for the matchers.
 * @param message
 * @returns {string}
 */
function constructDiffMessage(message) {
    return 'The content was different, please review the result of the diff:\n\n' + message + '\n';
}

/**
 * Using the diff package `diffChars()` colorize the output of the patch character by character.
 * @param actual
 * @param expected
 * @returns {string}
 */
function diffChars(actual, expected) {
    var diffResult = diff.diffChars(actual, expected);
    var message = '';

    diffResult.forEach(function (diffPart) {
        var partColor = resolveColor(diffPart);
        message += (diffPart.value[partColor]);
    });

    return message;
}

/**
 * Using the diff package `diffLines()` colorize the output of the patch line by line.
 * @param actual
 * @param expected
 * @returns {string}
 */
function diffLines(actual, expected) {
    var diffResult = diff.diffLines(actual, expected);
    var message = '';

    diffResult.forEach(function (diffPart) {
        var partColor = resolveColor(diffPart);
        message += (diffPart.value[partColor]);
    });

    return message;
}

/**
 * Using the diff package `createPatch()` colorize the output of the patch line by line.
 * @param actual
 * @param expected
 * @param fileName
 * @returns {string}
 */
function diffPatch(actual, expected, fileName) {
    fileName = fileName || '';
    var diffResult = diff.createPatch(fileName, actual, expected);

    var lines = diffResult.split(/\r?\n/);
    var resultLines = [];

    // Colorize the patch view
    lines.forEach(function (line) {
        if (line.substring(0, 1).indexOf('+') > -1) {
            line = colors[addedColor](line);
        } else if (line.substring(0, 1).indexOf('-') > -1) {
            line = colors[deletionsColor](line);
        } else {
            line = colors[sameColor](line);
        }
        resultLines.push(line);
    })

    var message = resultLines.join('\n');

    return message;
}