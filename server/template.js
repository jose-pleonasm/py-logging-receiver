
module.exports = `<!DOCTYPE html>
<html lang="cs">
	<head>
		<meta charset="utf-8">
		<title>py-logging logs</title>
		<script type="text/javascript" src="/static/config.js"></script>
		<script type="text/javascript" src="/static/app.js"></script>
	</head>
	<body>
		<script type="text/javascript">
			App.process(%(records));
		</script>
	</body>
</html>`;
