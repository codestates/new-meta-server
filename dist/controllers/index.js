const express = require("express");
const jwt = require("jsonwebtoken");
module.exports = {
    index: (req, res) => {
        res.status(200).send("연결: 성공");
    },
};
//# sourceMappingURL=index.js.map