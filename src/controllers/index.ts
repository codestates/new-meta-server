import { Request, Response } from "express";

module.exports = {
	index: (req: Request, res: Response) => {
		res.status(200).send("연결: 성공");
	},
};
