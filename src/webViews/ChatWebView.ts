export default function getWebviewContentForChat(): string{
    return /*html*/`
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Interface</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --background: hsl(0 0% 100%);
                --foreground: hsl(222.2 84% 4.9%);
                --card: hsl(0 0% 100%);
                --card-foreground: hsl(222.2 84% 4.9%);
                --popover: hsl(0 0% 100%);
                --popover-foreground: hsl(222.2 84% 4.9%);
                --primary: hsl(222.2 47.4% 11.2%);
                --primary-foreground: hsl(210 40% 98%);
                --secondary: hsl(210 40% 96.1%);
                --secondary-foreground: hsl(222.2 47.4% 11.2%);
                --muted: hsl(210 40% 96.1%);
                --muted-foreground: hsl(215.4 16.3% 46.9%);
                --accent: hsl(210 40% 96.1%);
                --accent-foreground: hsl(222.2 47.4% 11.2%);
                --destructive: hsl(0 84.2% 60.2%);
                --destructive-foreground: hsl(210 40% 98%);
                --border: hsl(214.3 31.8% 91.4%);
                --input: hsl(214.3 31.8% 91.4%);
                --ring: hsl(222.2 84% 4.9%);
                --radius: 0.5rem;
            }

            @media (prefers-color-scheme: dark) {
                :root {
                    --background: hsl(222.2 84% 4.9%);
                    --foreground: hsl(210 40% 98%);
                    --card: hsl(222.2 84% 4.9%);
                    --card-foreground: hsl(210 40% 98%);
                    --popover: hsl(222.2 84% 4.9%);
                    --popover-foreground: hsl(210 40% 98%);
                    --primary: hsl(210 40% 98%);
                    --primary-foreground: hsl(222.2 47.4% 11.2%);
                    --secondary: hsl(217.2 32.6% 17.5%);
                    --secondary-foreground: hsl(210 40% 98%);
                    --muted: hsl(217.2 32.6% 17.5%);
                    --muted-foreground: hsl(215 20.2% 65.1%);
                    --accent: hsl(217.2 32.6% 17.5%);
                    --accent-foreground: hsl(210 40% 98%);
                    --destructive: hsl(0 62.8% 30.6%);
                    --destructive-foreground: hsl(210 40% 98%);
                    --border: hsl(217.2 32.6% 17.5%);
                    --input: hsl(217.2 32.6% 17.5%);
                    --ring: hsl(212.7 26.8% 83.9%);
                }
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--background);
                color: var(--foreground);
                margin: 0;
                padding: 16px;
                display: flex;
                flex-direction: column;
                height: 100vh;
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
            }

            .chat-container {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                overflow-y: auto;
                padding: 16px;
                gap: 12px;
                background-color: var(--card);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                margin-bottom: 16px;
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }

            .message {
                padding: 12px 16px;
                border-radius: var(--radius);
                max-width: 85%;
                line-height: 1.5;
                font-size: 0.925rem;
                transition: all 0.2s ease;
                animation: messageSlide 0.3s ease forwards;
                opacity: 0;
                transform: translateY(10px);
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
                hyphens: auto;
            }

            .message pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
                background-color: var(--accent);
                padding: 12px;
                border-radius: calc(var(--radius) - 2px);
                margin: 8px 0;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.875rem;
            }

            .message code {
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 0.875rem;
                background-color: var(--accent);
                padding: 2px 4px;
                border-radius: 4px;
            }

            .message a {
                color: inherit;
                text-decoration: underline;
                text-decoration-thickness: 1px;
                text-underline-offset: 2px;
                transition: opacity 0.2s ease;
            }

            .message a:hover {
                opacity: 0.8;
            }

            @keyframes messageSlide {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .message.user {
                background-color: var(--primary);
                color: var(--primary-foreground);
                align-self: flex-end;
                border-bottom-right-radius: calc(var(--radius) / 2);
            }

            .message.ai {
                background-color: var(--muted);
                color: var(--muted-foreground);
                align-self: flex-start;
                border-bottom-left-radius: calc(var(--radius) / 2);
            }

            .input-container {
                display: flex;
                gap: 8px;
                padding: 8px;
                background-color: var(--card);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            }

            input[type="text"] {
                flex-grow: 1;
                padding: 12px 16px;
                border-radius: var(--radius);
                border: 1px solid var(--input);
                background-color: transparent;
                color: var(--foreground);
                font-family: inherit;
                font-size: 0.925rem;
                transition: all 0.2s ease;
            }

            input[type="text"]:focus {
                outline: none;
                border-color: var(--ring);
                box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
            }

            input[type="text"]::placeholder {
                color: var(--muted-foreground);
            }

            button {
                padding: 12px 24px;
                border: 1px solid var(--primary);
                background-color: var(--primary);
                color: var(--primary-foreground);
                border-radius: var(--radius);
                cursor: pointer;
                font-family: inherit;
                font-size: 0.925rem;
                font-weight: 500;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            button:hover {
                opacity: 0.9;
            }

            button:active {
                transform: scale(0.98);
            }

            button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Custom scrollbar */
            .chat-container::-webkit-scrollbar {
                width: 8px;
            }

            .chat-container::-webkit-scrollbar-track {
                background: var(--muted);
                border-radius: var(--radius);
            }

            .chat-container::-webkit-scrollbar-thumb {
                background: var(--muted-foreground);
                border-radius: var(--radius);
            }

            /* Loading animation */
            .loading {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background-color: var(--muted);
                color: var(--muted-foreground);
                border-radius: var(--radius);
                max-width: 85%;
                align-self: flex-start;
                border-bottom-left-radius: calc(var(--radius) / 2);
                animation: messageSlide 0.3s ease forwards;
            }

            .loading-dots {
                display: flex;
                gap: 4px;
            }

            .loading-dots span {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: currentColor;
                opacity: 0.5;
                animation: loadingDot 1.4s infinite;
            }

            .loading-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .loading-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes loadingDot {
                0%, 100% {
                    opacity: 0.5;
                    transform: scale(1);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.1);
                }
            }
        </style>
    </head>
    <body>
        <div class="chat-container" id="chatContainer">
            <div class="message ai">Hello! How can I assist you today?</div>
        </div>
        <div class="input-container">
            <input type="text" id="userMessage" placeholder="Type your message..." />
            <button onclick="sendMessage()" id="sendButton">Send</button>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            let isWaitingForResponse = false;

            function setLoading(loading) {
                isWaitingForResponse = loading;
                const sendButton = document.getElementById('sendButton');
                const inputField = document.getElementById('userMessage');
                
                sendButton.disabled = loading;
                inputField.disabled = loading;

                if (loading) {
                    const chatContainer = document.getElementById('chatContainer');
                    const loadingDiv = document.createElement('div');
                    loadingDiv.className = 'loading';
                    loadingDiv.id = 'loadingIndicator';
                    loadingDiv.innerHTML = 'Loading...';
                    chatContainer.appendChild(loadingDiv);
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                } else {
                    const loadingIndicator = document.getElementById('loadingIndicator');
                    if (loadingIndicator) {
                        loadingIndicator.remove();
                    }
                }
            }

            function sendMessage() {
                if (isWaitingForResponse) return;

                const inputField = document.getElementById('userMessage');
                const userMessage = inputField.value;

                if (userMessage.trim()) {
                    // Add the user's message to the chat container
                    const chatContainer = document.getElementById('chatContainer');
                    const userMessageDiv = document.createElement('div');
                    userMessageDiv.className = 'message user';
                    userMessageDiv.textContent = userMessage;
                    chatContainer.appendChild(userMessageDiv);

                    // Show loading indicator
                    setLoading(true);

                    // Send the message to the extension
                    vscode.postMessage({
                        type: 'sendMessage',
                        text: userMessage
                    });

                    // Clear the input field
                    inputField.value = '';

                    // Scroll to the bottom
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }

            // Add event listener for Enter key
            document.getElementById('userMessage').addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !isWaitingForResponse) {
                    sendMessage();
                }
            });

            // Listen for responses from the extension
            window.addEventListener('message', event => {
                const message = event.data;

                if (message.type === 'displayResponse') {
                    // Hide loading indicator
                    setLoading(false);

                    // Add AI response to the chat container
                    const chatContainer = document.getElementById('chatContainer');
                    const aiMessageDiv = document.createElement('div');
                    aiMessageDiv.className = 'message ai';
                    aiMessageDiv.innerHTML = message.html;
                    chatContainer.appendChild(aiMessageDiv);

                    // Scroll to the bottom
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            });
        </script>
    </body>
    </html>
		`;
};
