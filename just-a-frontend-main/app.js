const express = require("express");
const app = express();
const path = require("path");
const { stringReplace } = require('string-replace-middleware');

app.use(stringReplace({
	'%%HOSTNAME%%': process.env.BACKEND_HOST,
}));

// serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// serve the index.html file as the root page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// start the server
app.listen(8080, () => {
  console.log("Frontend listening on port 8080");
});