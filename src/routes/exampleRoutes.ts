import { postGetAllAction } from "../controllers/examples/PostGetAllAction";
import { postGetByIdAction } from "../controllers/examples/PostGetByIdAction";
import { postSaveAction } from "../controllers/examples/PostSaveAction";

/**
 * All application routes.
 */
export const AppRoutes = [
	{
		path: "/posts",
		method: "get",
		action: postGetAllAction,
	},
	{
		path: "/posts/:id",
		method: "get",
		action: postGetByIdAction,
	},
	{
		path: "/posts",
		method: "post",
		action: postSaveAction,
	},
];
