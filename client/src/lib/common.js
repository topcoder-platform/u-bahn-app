import { getFreshToken, decodeToken } from "@topcoder-platform/tc-auth-lib";
import config from "../config";

/**
 * Returns the nickname of the logged in user
 */
export async function getNickname() {
  try {
    const token = await getFreshToken();

    const user = decodeToken(token);
    return user[config.AUTH.handleClaims];
  } catch (error) {
    console.log(
      "An error occurred trying to retrieve the nickname of the logged in user"
    );
    console.log(error);
    alert("An error occurred. Try logging out and then log back in");
  }
}
