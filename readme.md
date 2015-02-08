Custom Jasmine matchers for seeing a more useful output when comparing Strings.

For example you may want to compare files, seeing the output from `expect(expected).toBe(result)`
only outputs the entire comparison with no hint to any deletions, additions and what is the same.

Using the [diff](https://www.npmjs.com/package/diff) the result of the diff matchers will be colored like
your regular vcs tooling.

### Examples

See the examples in the `./example/*` folder. Using the matchers requires you to add them using
the Jasmine `addMatchers()` api in a `beforeEach` block, Example.

 ```
     beforeEach(function () {
         this.addMatchers(require('jasmine-diff-matchers').diffPatch);
     });
 ```

Now the custom matchers are added to the Jasmine api just like any other core matcher:

```
    it('should have the expected output to compare the cosmos', function () {
        expect('compare/cosmos.txt').diffPatch('expected/cosmos.txt');
    });
```