"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUri = void 0;
const secret_manager_1 = require("@google-cloud/secret-manager");
const dotenv = require("dotenv");
var envTypes;
(function (envTypes) {
    envTypes[envTypes["dev_uri"] = 0] = "dev_uri";
    envTypes[envTypes["local_uri"] = 1] = "local_uri";
    envTypes[envTypes["prod_uri"] = 2] = "prod_uri";
})(envTypes || (envTypes = {}));
async function getUri() {
    var _a, _b;
    dotenv.config();
    const client = new secret_manager_1.SecretManagerServiceClient();
    const projectName = process.env.GCLOUD_PROJECT;
    const envs = Object.keys(envTypes).filter((key) => isNaN(Number(key)));
    const res = [];
    for (const env of envs) {
        const name = `projects/${projectName}/secrets/${env}/versions/latest`;
        const [version] = await client.accessSecretVersion({
            name: name,
        });
        const payload = (_b = (_a = version.payload) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.toString();
        if (payload) {
            res.push(payload);
        }
    }
    res.push(process.env.MONGO_LINK);
    res.push(process.env.MONGO_USER);
    return res;
}
exports.getUri = getUri;
//# sourceMappingURL=env.js.map