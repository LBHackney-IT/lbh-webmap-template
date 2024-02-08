import express from 'express';
var app = express();
import  path from "path";
import  nunjucks from "nunjucks";

// Define port to run server on
var port = process.env.PORT || 9000;

// Configure Nunjucks
var _templates = process.env.NODE_PATH
  ? process.env.NODE_PATH + "/templates"
  : "templates";
var _templates = [
  "",
  "node_modules/lbh-frontend/lbh/",
  "node_modules/lbh-frontend/lbh/components/",
  "node_modules/govuk-frontend/govuk/",
  "node_modules/govuk-frontend/govuk/components/"
];
nunjucks.configure(_templates, {
  autoescape: true,
  cache: false,
  express: app
});
// Set Nunjucks as rendering engine for pages with .html suffix
app.engine("html", nunjucks.render);
app.set("view engine", "html");
app.use("/dist", express.static("dist"));
app.use("/images", express.static("images"));
app.use("/assets", express.static("node_modules/lbh-frontend/lbh/assets"));
app.use("/assets", express.static("node_modules/govuk-frontend/govuk/assets"));
app.use("/data", express.static("data"));
app.use("/lbhfrontend", express.static("node_modules/lbh-frontend/lbh"));


app.get("/dist/:page", function(req, res) {
  res.render('dist/' + req.params.page);
});

app.get("/images/:page", function(req, res) {
  res.render('images/' + req.params.page);
});

// Respond to all GET requests by rendering relevant page using Nunjucks
app.get("/:project/:page", function(req, res) {
  res.render('templates/' + req.params.project + '/' + req.params.page, {}, function(err, html) {
    if (err) {
      var template = req.params.page === 'index.html' ? 'template.html' : req.params.page;
      res.render('templates/base-' + template);
    } else {
      res.send(html);
    }
  });
});

app.get("/:page", function(req, res) {
  res.render(req.params.page);
});



// Start server
app.listen(port);
console.log("Listening on port %s...", port);
