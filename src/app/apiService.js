import axios from "axios";
import { BASE_URL } from "./config";

const apiService = axios.create({
    baseURL: BASE_URL,
});

console.log("BASE_URL", BASE_URL);
apiService.interceptors.request.use(
    (request) => {
        console.log("Start Request", request);
        return request;
    },
    function (error) {
        console.log("REQUEST ERROR", error);
        return Promise.reject(error);
    }
);

apiService.interceptors.response.use(
    (response) => {
        console.log("Response", response);
        return response;
    },
    function (error) {
        console.log("RESPONSE ERROR", error);
        let message = error.response?.data?.message || "Uknown Error";
        if (message.includes("user.phone_Number")) {
            message = "Số điện thoại đã tồn tại";
        }
        if (message.includes("Data too long for column 'phone_Number'")) {
            message = "Số điện thoại không quá 10 số";
        }
        console.log(message);
        return Promise.reject({ message });
    }
);

export default apiService;
