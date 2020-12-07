const express = require("express");
const Bundler = require("parcel-bundler");
const httpProxy = require("http-proxy");

const bundler = new Bundler("ui/index.html", { outDir: "./static/dev" });
const server = httpProxy.createProxyServer({});

const app = express();

const API_BACKEND = "http://localhost:9000/api/";

const port = 1234;

const proxy = (url) => {
  return (req, res) => {
    server.web(
      req,
      res,
      {
        target: url,
        ws: true,
      },
      (e) => {
        console.error(e);
        res.status(500).json({ msg: e.message });
      }
    );
  };
};

app.use("/api", proxy(API_BACKEND));

app.use(bundler.middleware());

app.listen(port, () => console.log(`Dev server started on :${port}`));
