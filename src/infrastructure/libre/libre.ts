import * as ax from "axios";
import * as https from "https";
import { appConfig } from "../../config";
export const libreUrl = appConfig.LIBRE_URL;

const axios = ax.default.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),

  headers: {
    "X-Auth-Token": appConfig.LIBRE_TOKEN,
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

async function request<T>(url: string) {
  const result = await axios.get(`${libreUrl}${url}`);
  if (result.data.error) {
    throw new Error(result.data.error);
  }
  return result.data as T;
}

export const libbreApi = {
  request,
};
