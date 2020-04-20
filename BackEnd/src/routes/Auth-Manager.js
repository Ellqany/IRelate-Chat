import { wrapAsync } from "../utils/controllers";
import { requireAuthHeader } from "../controllers/authenticate/authenticate.action";
import { getUser } from "../controllers/Auth-Management";

module.exports = api => {
  api.route("/Auth0Manager-action").post(requireAuthHeader, wrapAsync(getUser));
};
