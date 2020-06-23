import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";

import trackerAPI from "../api/Tracker";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return {
        ...state,
        errorMessage: action.payload,
        fetching: false,
      };
    case "fetching_started":
      return {
        ...state,
        errorMessage: "",
        fetching: true,
      };
    case "signup":
    case "signin":
      return {
        token: action.payload,
        fetching: false,
        errorMessage: "",
      };
    case "clear_error_message":
      return {
        ...state,
        fetching: false,
        errorMessage: "",
      };
    case "signout":
      return {
        token: null,
        errorMessage: "",
        fetching: false,
      };
    default:
      return state;
  }
};

const signup = (dispatch) => async ({ email, password }) => {
  try {
    dispatch({ type: "fetching_started" });
    const response = await trackerAPI.post("/signup", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signup", payload: response.data.token });
    navigate("TrackList");
  } catch (error) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with Sign Up",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    dispatch({ type: "fetching_started" });
    const response = await trackerAPI.post("/signin", { email, password });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("TrackList");
  } catch (error) {
    console.log(error);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with Sign In",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const tryLocalSignIn = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("TrackList");
  } else {
    navigate("SignUp");
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignIn },
  { token: null, errorMessage: "", fetching: false }
);
