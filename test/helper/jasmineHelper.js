var spawn = require('child_process').spawn,
    Q = require('q');

/**
 * Shortcut to programatically run a command line tool and return the process object
 * @param args
 * @param cwd
 * @returns {*}
 */
function runJasmine(args, cwd) {
    args = args || [];
    cwd = cwd || __dirname;

    var angularity = spawn('jasmine-node', args, {cwd: cwd});
    angularity.stdout.setEncoding('utf8');

    return angularity;
};

/**
 * Shortcut to programatically run a command line tool and return a promise.
 * The promise will resolve the result of the command, {code, stdout, stderr}:
 * @param args
 * @param cwd
 * @returns {promise|*|Q.promise}
 */
function runJasmineQ(args, cwd) {
    var deferred = Q.defer();

    var stdout,
        stderr;

    var jasmineProcess = runJasmine(args, cwd);

    jasmineProcess.stdout.on('data', function (data) {
        stdout += data;
    });

    jasmineProcess.stderr.on('data', function (data) {
        stderr += data;
    });

    jasmineProcess.on('exit', function (code) {
        deferred.resolve({
            code: code,
            stdout: stdout,
            stderr: stderr
        });
    });

    return deferred.promise;
}

/**
 * To run the same tests and expect the same output negate the `Finished in` line of the output.
 * The content must contain text that is separated by line breaks.
 * @param content
 * @returns {string}
 */
function removeFinishedLine(content) {
    var lines = content.split(/\r?\n/);
    var resultLines = [];

    lines.forEach(function (line) {
        if (line.indexOf('Finished in') === -1) {
            resultLines.push(line);
        }
    })

    return resultLines.join('\n');
}

module.exports = {
    removeFinishedLine: removeFinishedLine,
    runJasmine: runJasmine,
    runJasmineQ: runJasmineQ
};