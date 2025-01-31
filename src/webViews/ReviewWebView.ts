export default function getWebviewContentForReview(reviewContent: string): string {
    return /*html*/`
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
				<h3>Seek Review [Powered by deepseek-r1]</h3>
				<div>${reviewContent}</div>
			</div>
		</body>
		</html>
		`;
};
