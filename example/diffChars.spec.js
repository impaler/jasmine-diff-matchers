require('../index').basePath = 'example';

describe('Custom matcher: diffChars diffs two blocks of text, comparing character by character.', function () {

    beforeEach(function () {
        this.addMatchers(require('../matchers/diffChars'));
    });

    it('should toEqualContents', function () {
        expect('one two three').diffChars('one three two');
    });

    it('should toEqualContents', function () {
        expect('one two three').diffChars('one two threee');
    });

    it('should toEqualFileContents', function () {
        expect('compare/cosmos.txt').diffFileChars('expected/cosmos.txt');
    });

});