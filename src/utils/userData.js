const getUserName = () => {
  return localStorage.getItem("UserName");
};

const getUserZip = () => {
  return localStorage.getItem("UserZip");
};

const getAvatar = () => {
  return localStorage.getItem("UserProfileAvatar")
}

export { getUserName, getUserZip, getAvatar};
