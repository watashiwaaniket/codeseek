import * as vscode from 'vscode';
import ollama from 'ollama';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('codeSeek up and running.');
	
	// Register a completion provider for all languages
    const provider = vscode.languages.registerCompletionItemProvider('*', { // '*' means all languages
        async provideCompletionItems(document, position) {
            // Get the text before the cursor
            const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));

            // Get the language of the current document
            const languageId = document.languageId;

            try {
                // Call the Ollama API with the language context
                const response = await ollama.chat({
                    model: 'deepseek-r1:7b',
                    messages: [{ role: 'user', content: `You are a coding assistant. Provide a code suggestion in ${languageId} for the following:\n${textBeforeCursor}` }]
					,
                });

                // Extract the AI response
                const aiResponse = response.message.content;

                // Return the AI response as a completion item
                return [new vscode.CompletionItem(aiResponse, vscode.CompletionItemKind.Text)];
            } catch (error) {
                console.error('Error fetching AI suggestion:', error);
                return [];
            }
        },
    });


	// Add the provider to the subscriptions
	context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
