import * as vscode from 'vscode';
import { toggleSpecAndImpl } from './spec_resolver';

export function activate(context: vscode.ExtensionContext) {
	console.log('rails-navigator initializing...');

	let disposable = vscode.commands.registerCommand('rails-navigator.toggle-spec-impl', toggleSpecAndImpl);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
