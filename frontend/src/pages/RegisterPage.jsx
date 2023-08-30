import RegisterPageComponent from "./components/RegisterPageComponent";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setReduxUserState } from "../redux/actions/userActions";

const registerUserApiRequest = async (name, lastName, email, password, phoneNumber, country, city, street, homeNumber, localNumber, zipCode) => {
  const { data } = await axios.post("/api/users/register", { name, lastName, email, password, phoneNumber, country, city, street, homeNumber, localNumber, zipCode });
  sessionStorage.setItem("userInfo", JSON.stringify(data.userCreated));
  if (data.success === "User created") {
    window.location.href = "/user";
  }
  return data;
}

function RegisterPage() {

  const reduxDispatch = useDispatch();

  return <RegisterPageComponent registerUserApiRequest={registerUserApiRequest} reduxDispatch={reduxDispatch} setReduxUserState={setReduxUserState} />
}

export default RegisterPage;
