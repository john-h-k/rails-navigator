import * as assert from 'assert';
import * as vscode from 'vscode';
import * as resolver from '../../spec_resolver';
import path = require('path');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

    let testCases = [
        [["app", "bar.rb"], ["spec", "bar_spec.rb"]],

        [["app", "foo", "bar.rb"], ["spec", "foo", "bar_spec.rb"]],

        [["app", "foo", "bar.other_ext.rb"], ["spec", "foo", "bar_spec.other_ext.rb"]],

        [["app", "foo", "bar.custom_ruby_ext"], ["spec", "foo", "bar_spec.custom_ruby_ext"]],
    ];

    suite('switchFile', () => {
        for (let [impl, spec] of testCases) {
            test(`correctly transforms impl '${path.join(...impl)}' -> spec '${path.join(...spec)}'`, () => {
                assert.deepEqual(
                    resolver.switchFile(impl),
                    spec
                );
            });

            test(`correctly transforms spec '${path.join(...spec)}' -> impl '${path.join(...impl)}'`, () => {
                assert.deepEqual(
                    resolver.switchFile(spec),
                    impl
                );
            });
        }

        test('ignores invalid paths', () => {
            assert.deepEqual(
                resolver.switchFile(["not_valid", "foo", "bar.rb"]),
                undefined
            );

            assert.deepEqual(
                resolver.switchFile([]),
                undefined
            );

            assert.deepEqual(
                resolver.switchFile(["spec"]),
                undefined
            );

            assert.deepEqual(
                resolver.switchFile(["app"]),
                undefined
            );
        });
    });
});
