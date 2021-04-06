// require
const express = require("express");
const morgan = require("morgan");
const summonerRouter = require("./routes/summoner");

// 기본 설정
const app = express();
app.use(morgan("dev"));

// 라우트
app.get("/", (req, res) => res.send("test"));
app.use("/summoner", summonerRouter);

// 서버 구동
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
