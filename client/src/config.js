import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});

export const startUrl = "http://localhost:3000/";