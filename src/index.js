import { createAppContainer } from "react-navigation";
import { createStackNavigator, } from "react-navigation-stack";

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  AuthLoadingScreen,
  Dashboard,
  WelCome,
  UserDashBoard,
  AssignmentDetail
} from "./screens";

const Router = createStackNavigator(
  {
    WelCome,
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    Dashboard,
    AuthLoadingScreen,
    UserDashBoard,
    AssignmentDetail
  },
  {
    initialRouteName: "AuthLoadingScreen",
    headerMode: "none"
  }
);

export default createAppContainer(Router);
