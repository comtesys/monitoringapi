import { hostname } from "os";
import { zabbixApi } from "../infrastructure/zabbix/zabbix";
import { ZabbixExtendedHost, ZabbixProblem, ZabbixResult, ZabbixTrigger } from "../infrastructure/zabbix/zabbix.models";
import { getZabbixStatistics } from "../infrastructure/zabbix/zabbix.statistics";
import { router } from "../server";

router.get("/api/zabbix/hosts", async ctx => {
  const result = await zabbixApi.request<ZabbixExtendedHost[]>("host.get", {
    selectItems: ["itemid", "name"],
    selectTriggers: ["host", "description", "status"],
    selectTags: ["tag", "value"],
    selectGroups: ["group", "name"],
  });

  result.forEach(r => {
    r.triggers = r.triggers?.filter(f => f.status === "0");
  });

  ctx.body = result;
});

router.get("/api/zabbix/host/:name", async ctx => {
  const hostName = ctx.params["name"];
  let hosts: ZabbixExtendedHost[] = [];
  if (isNaN(Number(hostName))) {
    hosts = await zabbixApi.request<ZabbixExtendedHost[]>("host.get", {
      selectItems: ["itemid", "name"],
      selectTriggers: ["host", "description", "status"],
      selectTags: ["tag", "value"],
      selectGroups: ["group", "name"],
      filter: { host: [hostName] },
    });
  } else {
    hosts = await zabbixApi.request<ZabbixExtendedHost[]>("host.get", {
      hostids: hostName,
      selectItems: ["itemid", "name"],
      selectTriggers: ["host", "description", "status"],
      selectTags: ["tag", "value"],
      selectGroups: ["group", "name"],
    });
  }

  if (hosts.length > 0) {
    const host = hosts[0];
    host.triggers = host.triggers?.filter(f => f.status === "0");
    ctx.body = host;
    return;
  }
  ctx.body = "notfound";
});

router.get("/api/zabbix/problems", async ctx => {
  const result = await zabbixApi.request("problem.get", {
    output: "extend",
  });
  ctx.body = result;
});

router.get("/api/zabbix/hostgroups", async ctx => {
  const result = await zabbixApi.request("hostgroup.get", {
    selectHosts: ["name"],
  });
  ctx.body = result;
});

router.get("/api/zabbix/triggers", async ctx => {
  const result = await zabbixApi.request("trigger.get", {
    selectHosts: ["hostid", "name", "maintenance_status"],
    selectItems: ["itemId", "name"],
  });
  ctx.body = result;
});

router.get("/api/zabbix/services", async ctx => {
  const result = await zabbixApi.request("item.get", { output: "extend" });
  ctx.body = result;
});

router.get("/api/zabbix/statistics", async ctx => {
  ctx.body = getZabbixStatistics();
});

router.get("/api/zabbix/triggers/:host/:triggerId", async ctx => {
  const hostName = ctx.params["host"];
  const triggerId = ctx.params["triggerId"];

  const apiTriggers = await getApiTrigger(triggerId, hostName);
  const trigger = apiTriggers.find(x => x.triggerid === triggerId);
  if (!trigger) {
    ctx.body = new ZabbixResult({ host: hostName, is_unknown: true });
    return;
  }

  const problems = await zabbixApi.request<ZabbixProblem[]>("problem.get", {
    objectids: triggerId.toString(),
  });
  if (problems.length > 0) {
    ctx.body = new ZabbixResult({ host: hostName }, problems[0], trigger);
    return;
  }
  ctx.body = new ZabbixResult({ host: hostName, is_ok: true }, null, trigger);
});

// cache
router.get("/api/zabbix/:host/:item", async ctx => {
  ctx.body = "not implemented";

  // const hostName = ctx.params["host"];
  // const itemName = ctx.params["item"];

  // const apiHosts = await getApiHosts();
  // const host = apiHosts.find((x) => x.name === hostName);
  // if (host) {
  //   ctx.body = new ZabbixResult({
  //     host: hostName,
  //     service: itemName,
  //     is_unknown: true,
  //   });
  //   return;
  // }

  // let item = host.items.find(
  //   (x) => x.name === itemName || x.itemid == itemName
  // );
  // if (!item) {
  //   ctx.body = new ZabbixResult({
  //     host: hostName,
  //     service: itemName,
  //     maintenance_status: host.maintenance_status,
  //     is_unknown: true,
  //   });
  //   return;
  // }

  // const apiProblems = await getApiProblems();
  // const apiTriggers = await getApiTriggers();

  // // prochazime vsechny triggery
  // for (let apiTrigger of apiTriggers) {
  //   let host = apiTrigger.hosts.find((x) => x.name === hostName);
  //   let item = apiTrigger.items.find((x) => x.name === itemName);

  //   if (host && item) {
  //     // tento trigger se vaze k sluzbe a hostovi
  //     const problem = apiProblems.find(
  //       (x) => x.objectid === apiTrigger.triggerid
  //     );
  //     if (problem) {
  //       ctx.body = new ZabbixResult(
  //         {
  //           host: hostName,
  //           service: itemName,
  //           maintenance_status: host.maintenance_status,
  //         },
  //         problem
  //       );
  //       return;
  //     }
  //   }
  // }
  // ctx.body = new ZabbixResult({
  //   host: hostName,
  //   service: itemName,
  //   maintenance_status: host.maintenance_status,
  //   is_ok: true,
  // });
});

export const getApiTrigger = async (id: any, host: any): Promise<ZabbixTrigger[]> => {
  const result = await zabbixApi.request<ZabbixTrigger[]>("trigger.get", {
    triggerids: id.toString(),
    host: host.toString(),
    selectHosts: ["hostid", "name", "maintenance_status"],
    selectItems: ["itemid", "name"],
  });
  return result;
};
