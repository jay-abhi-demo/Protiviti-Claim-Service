"use strict";
module.exports = (req, res) => {
  res
    .status(404)
    .json({ success: false, msg: "Request URL you looking for is not found!" });
};
