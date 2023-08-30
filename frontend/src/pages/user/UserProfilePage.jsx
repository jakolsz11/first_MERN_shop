import UserProfilePageComponent from "./components/UserProfilePageComponent";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setReduxUserState } from "../../redux/actions/userActions";

const updateUserApiRequest = async (
  name,
  lastName,
  password,
  phoneNumber,
  country,
  city,
  street,
  homeNumber,
  localNumber,
  zipCode
) => {
  const { data } = await axios.put("/api/users/profile", {
    name,
    lastName,
    password,
    phoneNumber,
    country,
    city,
    street,
    homeNumber,
    localNumber,
    zipCode,
  });
  return data;
};

const fetchUser = async (userId) => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

const UserProfilePage = () => {

  const reduxDispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);

  return (
    <UserProfilePageComponent
      updateUserApiRequest={updateUserApiRequest}
      fetchUser={fetchUser}
      userInfoFromRedux={userInfo}
      setReduxUserState={setReduxUserState}
      reduxDispatch={reduxDispatch}
      localStorage={window.localStorage}
      sessionStorage={window.sessionStorage}
    />
  );
};

export default UserProfilePage;
