import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "codeseek" is now active!');

	const disposable = vscode.commands.registerCommand('codeseek.initiate',async () => {

		const message = [{ 
			role: 'user', 
			content: 'how are you?' 
		}]

		const response = await ollama.chat({
			model: 'deepseek-r1:7b',
			messages: message
		})

		const answer = response.message.content;
		console.log(answer)
		//doing some string manipulation to clear out unnecessary text.
		function removeBeforeThink(str: string){
			return str.replace(/<think>[\s\S]*?<\/think>/, '').trim();
		}


		vscode.window.showInformationMessage(removeBeforeThink(answer));
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
