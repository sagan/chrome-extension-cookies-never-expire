<?php


if( !empty($_GET["set"]) ) {
	setcookie("test_cookie", "1", time() + 10);
}

?><html>
	<head>
	</head>
	<body>
		<span>Current Cookie Value: <?php echo $_COOKIE["test_cookie"]; ?></span><br />
		<button type="button" id="btn">Set</button><br />
		<span id="result"></span>
		<script type="text/javascript">
			let btn = document.querySelector("#btn");
			let result = document.querySelector("#result");
			btn.addEventListener("click", e => {
				result.innerHTML = "";
				let req = new XMLHttpRequest();
				req.open("GET", "?set=1");
				req.onload = e => {
					result.innerHTML = "set, reload to check effect.";
				};
				req.send();
			});
		</script>
	</body>
</html>
