import { createContext, useReducer, useEffect } from "react";
import apiService from "../app/apiService";

const initialState = {
    isInitialized: false,
    isAuthenticated: false,
    user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const SEND_EMAIL = "AUTH.SEND_EMAIL";
const SEND_OTP = "AUTH.SEND_OTP"
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCESS"

const reducer = (state, action) => {
    switch (action.type) {

        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case SEND_EMAIL:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
            };
        case SEND_OTP:
            return {
                ...state,

                user: action.payload.user,
            }
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };

        default:
            return state;
    }
};

const setSession = (token, user = null) => {
    if (token) {
        window.localStorage.setItem("token", token);
        if (user) {
            window.localStorage.setItem("user", JSON.stringify(user));
        }
        apiService.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        delete apiService.defaults.headers.common.Authorization;
    }
};
const getUserFromStorage = () => {
    const user = window.localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const AuthContext = createContext({ ...initialState });

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        const user = getUserFromStorage();
        if (user) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user },
            });
        }
    }, []);

    const login = async ({ username, password }) => {
        const response = await apiService.post("/login", { username, password },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        console.log("Data in response: ", response.data)
        const { user, token } = response.data;

        setSession(token, user);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: { user },
        });

        return user;
    };
    const sendEmailForgot = async ({ emailAddress }, callback) => {
        const response = await apiService.post("/otp/forgot", {
            emailAddress
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        console.log("Data in response: ", response.data)
        const { user } = response.data;

        dispatch({
            type: SEND_EMAIL,
            payload: { user },
        });

        callback();
    };
    const sendOTPForgot = async ({ emailAddress, otpCode }, callback) => {
        const response = await apiService.post("/otp/forgot-validation", { emailAddress, otpCode }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });


        console.log("Data in response: ", response.data)
        const { user } = response.data;

        dispatch({
            type: SEND_OTP,
            payload: { user },
        });

        callback();
    };
    const sendEmail = async ({ emailAddress }, callback) => {
        const response = await apiService.post("/otp/register", {
            emailAddress
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        console.log("Data in response: ", response.data)
        const { user, token } = response.data;

        dispatch({
            type: SEND_EMAIL,
            payload: { user },
        });

        callback();
    };
    const sendOTP = async ({ emailAddress, otpCode }, callback) => {
        const response = await apiService.post("/otp/register-validation", { emailAddress, otpCode }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });


        console.log("Data in response: ", response.data)
        const { user } = response.data;

        dispatch({
            type: SEND_OTP,
            payload: { user },
        });

        callback();
    };
    const register = async ({ emailAddress, phoneNumber, username, password }, callback) => {
        const response = await apiService.post("/register", { emailAddress, phoneNumber, username, password }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });


        const { user } = response.data;

        dispatch({
            type: REGISTER_SUCCESS,
            payload: { user },
        });

        callback();
    };

    const logout = async (callback) => {
        setSession(null);
        dispatch({ type: LOGOUT });
        callback();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                sendEmail,
                sendEmailForgot,
                sendOTP,
                sendOTPForgot,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };