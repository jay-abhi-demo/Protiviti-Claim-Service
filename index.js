// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config({ path: "./config/.env" });
const config = require("./config");
const ExpressServer = require("./expressServer");

const launchServer = async () => {
  try {
    this.expressServer = new ExpressServer(
      config.URL_PORT
    );
    this.expressServer.launch();
    console.info("Express server running");
  } catch (error) {
    console.error("Express Server failure", error.message);
    this.expressServer.close();
  }
};

launchServer().catch((e) => console.error(e));
