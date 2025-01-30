import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
	console.log('codeSeek up and running.');
	
    const disposable = vscode.commands.registerCommand('codeSeek.openWebview', () => {
        // Create and show a new Webview
        const panel = vscode.window.createWebviewPanel(
            'codeSeekChat', // Unique ID for the Webview
            'CodeSeek Chat', // Title of the Webview panel
            vscode.ViewColumn.Beside, // Open the Webview to the right of the editor
            {
                enableScripts: true, // Enable JavaScript in the Webview
                retainContextWhenHidden: true, // Retain Webview state when hidden
            }
        );

        // Set the HTML content for the Webview
        panel.webview.html = getWebviewContent();

        // Handle messages from the Webview
        panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'sendMessage':
                    // Get the user's message
                    const userMessage = message.text;

                    // Send the message to Ollama with streaming enabled
                    try {
                        const stream = await ollama.chat({
                            model: 'deepseek-r1:7b',
                            messages: [{ role: 'user', content: userMessage }],
                            stream: true, // Enable streaming
                        });

                        // Send each chunk of the response to the Webview
                        for await (const chunk of stream) {
                            panel.webview.postMessage({
                                command: 'receiveMessageChunk',
                                text: chunk.message.content,
                                isUser: false,
                            });
                        }

                        // Notify the Webview that the stream is complete
                        panel.webview.postMessage({
                            command: 'receiveMessageComplete',
                        });
                    } catch (error) {
                        console.error('Error fetching AI response:', error);
                        panel.webview.postMessage({
                            command: 'receiveMessage',
                            text: 'Failed to fetch AI response. Please try again.',
                            isUser: false,
                        });
                    }
                    break;
            }
        });
    });

    // Add the command to the extension's subscriptions
    context.subscriptions.push(disposable);
}

// Function to generate HTML content for the Webview
function getWebviewContent(): string {
    return /*HTML*/`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CodeSeek Chat</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    width: 400px;
                    height: 100vh;
                    background-color: #1e1e1e;
                    color: #ffffff;
                    display: flex;
                    flex-direction: column;
                }
                #chat {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    max-width: 80%;
                }
                .user {
                    background-color: #4CAF50;
                    align-self: flex-end;
                }
                .ai {
                    background-color: #333;
                    align-self: flex-start;
                }
                #input-container {
                    display: flex;
                    padding: 10px;
                    background-color: #252526;
                }
                #input {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    background-color: #333;
                    color: #ffffff;
                }
                #send {
                    margin-left: 10px;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .markdown-body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    word-wrap: break-word;
                }
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">
        </head>
        <body>
            <div id="chat"></div>
            <div id="input-container">
                <input id="input" type="text" placeholder="Type your message..." />
                <button id="send">Send</button>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                const chat = document.getElementById('chat');
                const input = document.getElementById('input');
                const sendButton = document.getElementById('send');

                // Handle send button click
                sendButton.addEventListener('click', () => {
                    const message = input.value.trim();
                    if (message) {
                        // Add the user's message to the chat
                        addMessage(message, true);

                        // Send the message to the extension
                        vscode.postMessage({
                            command: 'sendMessage',
                            text: message,
                        });

                        // Clear the input
                        input.value = '';
                    }
                });

                // Handle incoming messages from the extension
                window.addEventListener('message', (event) => {
                    const message = event.data;
                    if (message.command === 'receiveMessageChunk') {
                        addMessageChunk(message.text, message.isUser);
                    } else if (message.command === 'receiveMessageComplete') {
                        completeMessage();
                    }
                });

                // Add a message to the chat
                function addMessage(text, isUser) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('message');
                    messageElement.classList.add(isUser ? 'user' : 'ai');
                    messageElement.innerHTML = \`<div class="markdown-body">\${text}</div>\`;
                    chat.appendChild(messageElement);
                    chat.scrollTop = chat.scrollHeight; // Auto-scroll to the bottom
                }

                // Add a chunk of the AI's response to the chat
                let aiMessageElement = null;
                function addMessageChunk(text, isUser) {
                    if (!aiMessageElement) {
                        aiMessageElement = document.createElement('div');
                        aiMessageElement.classList.add('message');
                        aiMessageElement.classList.add(isUser ? 'user' : 'ai');
                        aiMessageElement.innerHTML = '<div class="markdown-body"></div>';
                        chat.appendChild(aiMessageElement);
                    }
                    const markdownBody = aiMessageElement.querySelector('.markdown-body');
                    markdownBody.textContent += text;
                    chat.scrollTop = chat.scrollHeight; // Auto-scroll to the bottom
                }

                // Complete the AI's message
                function completeMessage() {
                    aiMessageElement = null;
                }
            </script>
        </body>
        </html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
