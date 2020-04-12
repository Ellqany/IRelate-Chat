import { sendMail } from "../controllers/hook";

module.exports = api => {
  api.route("/hook").post(sendMail);
};
