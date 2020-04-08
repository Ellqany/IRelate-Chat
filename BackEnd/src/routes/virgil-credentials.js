import { requireAuthHeader } from "../controllers/authenticate/authenticate.action";

import { wrapAsync } from "../utils/controllers";
import { virgilCredentials } from "../controllers/virgil-credentials/virgil-credentials.action";

module.exports = api => {
  api.route("/virgil-credentials").post(requireAuthHeader, wrapAsync(virgilCredentials));
};
