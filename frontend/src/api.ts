import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const estimateRide = (data: { customer_id: string; origin: string; destination: string; }) =>
  API.post("/ride/estimate", data);

export const confirmRide = (data: {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: { id: number; name: string };
  value: number;
}) => API.patch("/ride/confirm", data);

export const getRideHistory = (customer_id: string, driver_id?: number) =>
  API.get(`/ride/${customer_id}`, { params: { driver_id } });
