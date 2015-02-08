require('../index').basePath = 'example';

describe('Custom matcher: diffPatch will display the diff in a patch format.', function () {

    beforeEach(function () {
        this.addMatchers(require('../matchers/diffPatch'));
    });

    it('should result in a pass given two identical files', function () {
        expect('compare/cosmos.txt').diffFilePatch('compare/cosmos.txt');
    });

    it('should result in a patch that shows the correct differences', function () {
        expect('compare/cosmos.txt').diffFilePatch('expected/cosmos.txt');
    });

});