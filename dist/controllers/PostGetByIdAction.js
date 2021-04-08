"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGetByIdAction = void 0;
const typeorm_1 = require("typeorm");
const Post_1 = require("../entity/Post");
/**
 * Loads post by a given id.
 */
function postGetByIdAction(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        // get a post repository to perform operations with post
        const postRepository = typeorm_1.getManager().getRepository(Post_1.Post);
        // load a post by a given post id
        const post = yield postRepository.findOne(request.params.id);
        // if post was not found return 404 to the client
        if (!post) {
            response.status(404);
            response.end();
            return;
        }
        // return loaded post
        response.send(post);
    });
}
exports.postGetByIdAction = postGetByIdAction;
//# sourceMappingURL=PostGetByIdAction.js.map