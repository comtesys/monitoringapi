import { ZabbixProblem, ZabbixTrigger, ZabbixExtendedHost } from "./zabbix.models";
import { zabbixApi } from "./zabbix";
import { appConfig } from "../../config";
import { ExpirationStrategy, MemoryStorage } from "../cache";
import { addZabbixCacheHits, addZabbixHits } from "./zabbix.statistics";

const cache = new ExpirationStrategy(new MemoryStorage());
const ttl = 60;

export const getApiProblems = async (): Promise<ZabbixProblem[]> => {
  if (!appConfig.USE_CACHE) {
    addZabbixHits();
    return zabbixApi.request<ZabbixProblem[]>("problem.get", {});
  }
  const cachedProblems = await cache.getItem<ZabbixProblem[]>("apiProblems");
  if (cachedProblems) {
    addZabbixCacheHits();
    return cachedProblems;
  }
  const result = await zabbixApi.request<ZabbixProblem[]>("problem.get", {});

  if (result) {
    await cache.setItem("apiProblems", result, { ttl });
  }
  addZabbixHits();
  return result;
};

export const getApiTriggers = async (): Promise<ZabbixTrigger[]> => {
  if (!appConfig.USE_CACHE) {
    addZabbixHits();
    return await zabbixApi.request<ZabbixTrigger[]>("trigger.get", {
      selectHosts: ["hostid", "name", "maintenance_status"],
      selectItems: ["itemid", "name"]
    });
  }

  const cachedTriggers = await cache.getItem<ZabbixTrigger[]>("apiTriggers");

  if (cachedTriggers) {
    addZabbixCacheHits();
    return cachedTriggers;
  }

  const result = await zabbixApi.request<ZabbixTrigger[]>("trigger.get", {
    selectHosts: ["hostid", "name", "maintenance_status"],
    selectItems: ["itemid", "name"]
  });

  if (result) {
    await cache.setItem("apiTriggers", result, { ttl });
  }
  addZabbixHits();
  return result;
};

export const getApiHosts = async (): Promise<ZabbixExtendedHost[]> => {
  if (!appConfig.USE_CACHE) {
    addZabbixHits();
    return await zabbixApi.request<ZabbixExtendedHost[]>("host.get", {
      selectItems: ["itemid", "name"]
    });
  }

  const cachedHosts = await cache.getItem<ZabbixExtendedHost[]>("apiHosts");

  if (cachedHosts) {
    addZabbixCacheHits();
    return cachedHosts;
  }

  const result = await zabbixApi.request<ZabbixExtendedHost[]>("host.get", {
    selectItems: ["itemid", "name"]
  });

  if (result) {
    await cache.setItem("apiHosts", result, { ttl });
  }
  addZabbixHits();
  return result;
};
