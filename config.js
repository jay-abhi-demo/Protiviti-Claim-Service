const path = require("path");

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: process.env.PORT,
  URL_PATH: "http://localhost",
  BASE_VERSION: "",
  PROJECT_DIR: __dirname,
};

config.STATUS = {
  PENDING_FROM_FPR: 3,
  PENDING_FROM_APPROVER: 4,
  APPROVED: 2,
  REJECTED_BY_APPROVER: 7,
  DRAFT_AT_FPR: 5,
  REJECTED_BY_AUDITOR: 8,
};

config.ROLES = {
  FPR: 1,
  HOD: 2,
  APPROVER: 3,
  AUDITOR: 4,
};

config.SWAGGER_YAML = path.join(config.ROOT_DIR, "swagger", "swagger.yaml");
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`;
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, "uploaded_files");

module.exports = config;
