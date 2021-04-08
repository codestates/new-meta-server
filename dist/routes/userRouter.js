"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const userCreate_1 = require("../controllers/users/userCreate");
exports.UserRoutes = [
    {
        path: "/users",
        method: "post",
        action: userCreate_1.userCreate,
    },
    // {
    //     path: '/users/login',
    //     method: 'post',
    //     action:
    // },
    // {
    //     path:'/users/logout',
    //     method: 'post',
    //     action:
    // },
    // {
    //     path: '/users/me',
    //     method: 'get',
    //     action:
    // },
    // {
    //     path: '/users/me',
    //     method: 'patch',
    //     action:
    // },
    // {
    //     path: '/users/me',
    //     method: 'delete',
    //     action:
    // }
];
//# sourceMappingURL=userRouter.js.map