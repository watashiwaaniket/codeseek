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
            content: 'You are an AI code reviewer, go through the content provided by the user and give your opinion on how well it is written and also any changes which can be done for enhancing performance. make sure the response is not more than 150words'
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

        // Create a new WebView panel
        const panel = vscode.window.createWebviewPanel(
            'codeseek.reviewPanel', // Panel ID
            'AI Code Review', // Panel title
            vscode.ViewColumn.Beside, // Show on the right side
            {
                enableScripts: true, // Allow scripts in the WebView
            }
        );

        // Set the HTML content of the WebView
        panel.webview.html = getWebviewContent(result);
    	});
	});

	// Function to get the WebView HTML content
	function getWebviewContent(reviewContent: string): string {
		return `
		<html>
		<head>
			<title>Seek Review [Powered by deepseek-r1]</title>
			<style>
				body {
					font-family: Arial, sans-serif;
					margin: 20px;
					color: #333;
				}
				.content {
					background-color: #f4f4f4;
					padding: 15px;
					border-radius: 5px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
			</style>
		</head>
		<body>
			<div class="content">
				<h3>AI Code Review</h3>
				<div>${reviewContent}</div>
			</div>
		</body>
		</html>
		`;
	}

	context.subscriptions.push(disposable, review);
}

export function deactivate() {}
