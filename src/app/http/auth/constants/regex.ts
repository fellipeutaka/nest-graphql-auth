/* A regular expression that checks for the following:
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character
*/
export const password = {
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  message:
    "Password must contain lowercase letters, uppercase letters, numbers and special characters",
};
