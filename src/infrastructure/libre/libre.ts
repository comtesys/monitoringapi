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
  try {
    const result = await axios.get(`${libreUrl}${url}`);
    return result.data as T;
  } catch (e) {
    //console.error(e);
    return null;
  }
}

export const libbreApi = {
  request,
};
