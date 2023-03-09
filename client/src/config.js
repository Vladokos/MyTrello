import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://my-trello-project.herokuapp.com/",
});

export const startUrl = "https://my-trello-project.herokuapp.com/";
