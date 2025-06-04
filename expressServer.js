const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const OpenApiValidator = require("express-openapi-validator");
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const config = require("./config");
const { trim_all } = require("request_trimmer");

const { errorHandler, notFoundHandler } = require("./middleware");
const { router } = require("./api");
// const { seedAllData } = require("./database/seeders");

class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    // this.openApiPath = openApiYaml;
    // try {
    //   this.schema = yaml.load(openApiYaml);
    // } catch (e) {
    //   console.error("failed to start Express Server", e.message);
    //   process.exit(1);
    // }
    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.app.use(compression({}));
    this.app.use(bodyParser.json({ limit: "50MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(xss());
    this.app.use(hpp());
    this.app.use(trim_all);
    //this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(this.schema));
    // this.app.use(helmet());
    // seedAllData();
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }
  }

  launch() {
    // validate all incoming request
    // this.app.use(
    //   OpenApiValidator.middleware({
    //     apiSpec: this.openApiPath,
    //     validateApiSpec: true,
    //     validateRequests: true,
    //     fileUploader: {
    //       dest: config.FILE_UPLOAD_PATH,
    //     },
    //   })
    // );
    // custom route and middleware setup
    this.app.use("/", router);
    //global error handler
    this.app.use(errorHandler);
    // swagger validator is added than no need to add notFoundHandler
    this.app.use(notFoundHandler);
    this.server = http.createServer(this.app).listen(this.port);
    console.log(`Listening on port ${this.port}`);
  }

  async close() {
    if (this.server !== undefined) {
      this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
