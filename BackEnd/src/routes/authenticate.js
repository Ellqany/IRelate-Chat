import { authenticate } from "../controllers/authenticate";

module.exports = api => {
    api.route("/authenticate").post(authenticate);
};