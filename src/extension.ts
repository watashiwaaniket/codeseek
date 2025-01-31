import * as vscode from 'vscode';
import ollama from 'ollama';
import { marked } from 'marked';

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

	//getting the content of the currently open file
	function getActiveEditorContent(): string | undefined{
		const editor = vscode.window.activeTextEditor;
		if(!editor){
			vscode.window.showInformationMessage('No Active Window Found!')
			return;
		}
		return editor.document.getText();
	}

	const review = vscode.commands.registerCommand('codeseek.review', async () => {
		const context = getActiveEditorContent() || '';

    // Show loading message while waiting for the response from Ollama
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Reviewing Code...",
        cancellable: false
    }, async (progress, token) => {
        const message = [{
            role: 'user',
            content: context
        }, {
            role: 'system',
            content: 'You are an AI code reviewer, go through the content provided by the user and give your opinion on how well it is written in a small paragraph, less than 40 words'
        }];

        // Wait for Ollama's response
        const response = await ollama.chat({
            model: 'deepseek-r1:7b',
            messages: message
        });

        const answer = response.message.content;
        console.log(answer);

        // Function to remove unnecessary text
        function removeBeforeThink(str: string) {
            return str.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }
		const result = await marked.parse(removeBeforeThink(answer))

        vscode.window.showInformationMessage(result);
    	});
	});


	context.subscriptions.push(disposable, review);
}

export function deactivate() {}
