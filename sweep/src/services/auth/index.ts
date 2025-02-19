import { getAgreements, getAgreementContent } from "./agreements";
import { login, socialLogin, logout, refresh, getProfile, me } from "./auth";
import { searchPerson } from "./people";
import { updateProfile, uploadProfileImage } from "./profiles";
import { checkUsernameEmail, checkPassword, requestCode, verifyCode, register } from "./register";

export {
  login,
  socialLogin,
  logout,
  refresh,
  getProfile,
  me,
  getAgreements,
  getAgreementContent,
  searchPerson,
  updateProfile,
  uploadProfileImage,
  checkUsernameEmail,
  checkPassword,
  requestCode,
  verifyCode,
  register,
};
