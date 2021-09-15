import * as ax from "axios";
import * as https from "https";
import { appConfig } from "../../config";
export const zabbixUrl = appConfig.ZABBIX_URL;

const axios = ax.default.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  timeout: 80000,
});

async function request<T>(method: string, params?: any) {
  const authToken = appConfig.ZABBIX_TOKEN;
  const data = {
    jsonrpc: "2.0",
    method: method,
    params: params,
    auth: authToken,
    id: 1,
  };
  const result = await axios.post(zabbixUrl, data);
  if (result.data.error) {
    console.log(result.data.error);
    throw new Error(result.data.error);
  }
  return result.data.result as T;
}

export const zabbixApi = {
  request,
};
