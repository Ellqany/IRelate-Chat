import { wrapAsync } from "../utils/controllers";
import { requireAuthHeader } from "../controllers/authenticate/authenticate.action";
import { streamCredentials } from "../controllers/stream-credentials/stream-credentials.action";

module.exports = api => {
  api.route("/stream-credentials").post(requireAuthHeader, wrapAsync(streamCredentials));
};
