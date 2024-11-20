import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "@pages/_layout/App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "https://api.snubaseball.com";
} else {
  axios.defaults.baseURL = "http://192.168.45.69:8000"; //"http://192.168.45.69:8000";
}
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config: any) {
  return config;
});

root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
