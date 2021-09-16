import { zabbixApi } from "../infrastructure/zabbix/zabbix";
import {
  getApiProblems,
  getApiTriggers,
  getApiHosts,
} from "../infrastructure/zabbix/zabbix.cache";
import { ZabbixResult } from "../infrastructure/zabbix/zabbix.models";
import fs from "fs";
import { getZabbixStatistics } from "../infrastructure/zabbix/zabbix.statistics";
import { router } from "../server";

router.get("/api/zabbix/hosts", async (ctx) => {
  const apiHosts = await getApiHosts();
  ctx.body = apiHosts;
});

router.get("/api/zabbix/hosts/:name", async (ctx) => {
  const hostName = ctx.params["name"];
  const apiHosts = await getApiHosts();
  const host = apiHosts.find(
    (x) => x.name === hostName || x.hostid === hostName
  );
  if (!host) {
    ctx.body = null;
    return;
  }
  //@ts-ignore
  host.triggers = host.triggers?.filter((f) => f.status === "0");
  ctx.body = host;
});

router.get("/api/zabbix/problems", async (ctx) => {
  const result = await zabbixApi.request("problem.get", {
    output: "extend",
  });
  ctx.body = result;
});

router.get("/api/zabbix/hostgroups", async (ctx) => {
  const result = await zabbixApi.request("hostgroup.get", {});
  ctx.body = result;
});

router.get("/api/zabbix/triggers", async (ctx) => {
  const result = await zabbixApi.request("trigger.get", {
    selectHosts: ["hostid", "name", "maintenance_status"],
    selectItems: ["itemId", "name"],
  });
  ctx.body = result;
});

router.get("/api/zabbix/services", async (ctx) => {
  const result = await zabbixApi.request("item.get", {
    output: "extend",
  });
  ctx.body = result;
});

router.get("/api/zabbix/statistics", async (ctx) => {
  ctx.body = getZabbixStatistics();
});

// cache
router.get("/api/zabbix/triggers/:host/:triggerId", async (ctx) => {
  const hostName = ctx.params["host"];
  const triggerId = ctx.params["triggerId"];

  const apiHosts = await getApiHosts();
  const host = apiHosts.find(
    (x) => x.name === hostName || x.hostid === hostName
  );
  if (!host) {
    ctx.body = new ZabbixResult({
      host: hostName,
      service: "",
      is_unknown: true,
    });
    return;
  }

  const apiProblems = await getApiProblems();
  const apiTriggers = await getApiTriggers();

  const trigger = apiTriggers.find((x) => x.triggerid === triggerId);
  if (!trigger) {
    ctx.body = new ZabbixResult({
      host: hostName,
      maintenance_status: host.maintenance_status,
      is_unknown: true,
    });
    return;
  }
  const problem = apiProblems.find((x) => x.objectid === triggerId);
  if (problem) {
    ctx.body = new ZabbixResult(
      { host: hostName, maintenance_status: host.maintenance_status },
      problem
    );
    return;
  }

  ctx.body = new ZabbixResult({
    host: hostName,
    maintenance_status: host.maintenance_status,
    is_ok: true,
    trigger: trigger,
  });
});

// cache
router.get("/api/zabbix/:host/:item", async (ctx) => {
  const hostName = ctx.params["host"];
  const itemName = ctx.params["item"];

  const isExist = fs.existsSync(__dirname + "/fake.json");
  if (isExist) {
    const fakeJson = JSON.parse(
      fs.readFileSync(__dirname + "/fake.json", "utf-8")
    );
    const fakeHostName = fakeJson[hostName];
    if (fakeHostName) {
      const fakeService = fakeHostName[itemName];
      if (fakeService) {
        ctx.body = { ...fakeService, is_fake: true };
        return;
      }
    }
  }

  const apiHosts = await getApiHosts();
  const host = apiHosts.find((x) => x.name === hostName);
  if (!host) {
    ctx.body = new ZabbixResult({
      host: hostName,
      service: itemName,
      is_unknown: true,
    });
    return;
  }

  let item = host.items.find(
    (x) => x.name === itemName || x.itemid == itemName
  );
  if (!item) {
    ctx.body = new ZabbixResult({
      host: hostName,
      service: itemName,
      maintenance_status: host.maintenance_status,
      is_unknown: true,
    });
    return;
  }

  const apiProblems = await getApiProblems();
  const apiTriggers = await getApiTriggers();

  // prochazime vsechny triggery
  for (let apiTrigger of apiTriggers) {
    let host = apiTrigger.hosts.find((x) => x.name === hostName);
    let item = apiTrigger.items.find((x) => x.name === itemName);

    if (host && item) {
      // tento trigger se vaze k sluzbe a hostovi
      const problem = apiProblems.find(
        (x) => x.objectid === apiTrigger.triggerid
      );
      if (problem) {
        ctx.body = new ZabbixResult(
          {
            host: hostName,
            service: itemName,
            maintenance_status: host.maintenance_status,
          },
          problem
        );
        return;
      }
    }
  }
  ctx.body = new ZabbixResult({
    host: hostName,
    service: itemName,
    maintenance_status: host.maintenance_status,
    is_ok: true,
  });
});
