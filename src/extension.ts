import * as vscode from 'vscode';
import ollama from 'ollama';
import { marked } from 'marked';
import getWebviewContentForChat from './webViews/ChatWebView';
import getWebviewContentForReview from './webViews/ReviewWebView';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "codeseek" is now active!');

	const disposable = vscode.commands.registerCommand('codeseek.initiate', async () => {
		// Create the WebView panel for the chat
		const panel = vscode.window.createWebviewPanel(
			'codeseek.chatPanel', // Panel ID
			'codeseek', // Panel title
			vscode.ViewColumn.Beside, // Display it on the right side
			{ enableScripts: true, retainContextWhenHidden: true } // Enable scripts in WebView
		);
	
		// Set the HTML content for the WebView (initial chat interface)
		panel.webview.html = getWebviewContentForChat();
	
		// Handle sending a message from the WebView (via postMessage)
		panel.webview.onDidReceiveMessage(async (message) => {
			if (message.type === 'sendMessage') {
				const userMessage = message.text;
	
				// Prepare the message to send to the LLM
				const chatMessage = [
					{ role: 'user', content: userMessage },
					{ role: 'system', content: 'You are an AI assistant helping with various queries.' }
				];
	
				// Send the message to the LLM
				const response = await ollama.chat({
					model: 'deepseek-r1:7b',
					messages: chatMessage
				});
	
				const answer = response.message.content;
				const cleanedAnswer = removeBeforeThink(answer);
	
				// Parse the response with marked
				const parsedResponse = marked.parse(cleanedAnswer);
	
				// Send the parsed response back to the WebView to display
				panel.webview.postMessage({ type: 'displayResponse', html: parsedResponse });
			}
		});
	});

	function removeBeforeThink(str: string): string {
		return str.replace(/<think>[\s\S]*?<\/think>/, '').trim();
	}

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
            'seekreview', // Panel title
            vscode.ViewColumn.Beside, // Show on the right side
            {
                enableScripts: true, // Allow scripts in the WebView
            }
        );

        // Set the HTML content of the WebView
        panel.webview.html = getWebviewContentForReview(result);
    	});
	});


	context.subscriptions.push(disposable, review);
}

export function deactivate() {}
