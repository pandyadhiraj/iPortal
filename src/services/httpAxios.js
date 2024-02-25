import axios from "axios";

export const httpAxios = axios.create({
  //baseURL: "http://localhost:1337",
  baseURL: "https://internship-portal-backend-l0hx.onrender.com",
  withCredentials: "true",
});

