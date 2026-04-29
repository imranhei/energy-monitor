console.log("NODE VERSION:", process.version);

const http = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error("Request error:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    })
    .listen(port, hostname, () => {
      console.log(`Next.js ready on http://${hostname}:${port} (dev=${dev})`);
    });
});