import { assert } from 'console';
import path = require('path');
import * as vscode from 'vscode';

export async function toggleSpecAndImpl() {
    let file = vscode.window.activeTextEditor?.document?.uri;

    if (file === undefined) {
        return;
    }

    let root = vscode.workspace.getWorkspaceFolder(file);

    if (root === undefined) {
        console.log(`rails-navigator abandoning ${file} as it was not opened within a rails folder`);
        return;
    }

    let components = path.normalize(vscode.workspace.asRelativePath(file)).split(path.sep);

    let newComponents = switchFile(components);

    if (newComponents === undefined) {
        console.log('rails-navigator abandoning as not in app or spec folder');
        return;
    }

    let newPath = path.join(root.uri.fsPath, ...newComponents);

    try {
        console.log(`rails-navigator opening ${newPath}`);
        let doc = await vscode.workspace.openTextDocument(newPath);
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);
    } catch (e) {
        console.log(`rails-navigator abandoning ${file} with error '${e}'`);
        await vscode.window.showErrorMessage(`No spec found for ${file}`);
    }
}

export function switchFile(components: string[]) {
    if (components.length < 2) {
        return;
    }

    if (components[0] === 'app') {
        return specFromImpl(components);
    } else if (components[0] === 'spec') {
        return implFromSpec(components);
    }
}

function implFromSpec(components: string[]) {
    assert(components.length > 0);

    // copy as we mutate
    components = [...components];

    let base = components.pop()!.replace('_spec.', '.');

    return ['app', ...components.slice(1), base];
}

function specFromImpl(components: string[]) {
    assert(components.length > 0);

    // copy as we mutate
    components = [...components];

    let base = components.pop()!.replace('.', '_spec.');

    return ['spec', ...components.slice(1), base];
}