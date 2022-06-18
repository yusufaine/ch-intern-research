"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = void 0;
const functions = require("firebase-functions");
const env_1 = require("./env");
exports.getSecret = functions.https.onRequest((req, res) => {
    (async () => {
        res.send(await env_1.getUri());
    })();
});
//# sourceMappingURL=index.js.map