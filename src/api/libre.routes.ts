import { libbreApi } from "../infrastructure/libre/libre";
import { router } from "../server";

router.get("/api/libre/services", async (ctx) => {
  const result = await libbreApi.request("/services");
  ctx.body = result;
});

router.get("/api/libre/devices", async (ctx) => {
  const result = await libbreApi.request("/devices");
  ctx.body = result;
});

router.get("/api/libre/devices/:name", async (ctx) => {
  const name = ctx.params["name"];
  const result = await libbreApi.request("/devices/" + name);
  const groups = await libbreApi.request("/devices/" + name + "/groups");
  //@ts-ignore
  result["groups"] = groups?.groups || [];

  ctx.body = result;
});

router.get("/api/libre/devices/:name/alerts", async (ctx) => {
  const name = ctx.params["name"];
  const result = (await libbreApi.request("/devices/" + name)) as any;
  result["is_unknown"] = true;
  result["is_warning"] = false;
  result["is_critical"] = false;
  result["is_ok"] = false;
  result["alerts"] = [];

  if (result.devices) {
    if (result.devices?.length > 0) {
      const device_id = result.devices[0].device_id;
      if (device_id) {
        result["is_unknown"] = false;
        result["is_ok"] = true;
        const resultAlerts = (await libbreApi.request("/alerts")) as any;
        if (resultAlerts && resultAlerts.alerts.length > 0) {
          const deviceAlerts = resultAlerts.alerts.filter(
            (f: any) => f.device_id === device_id
          );
          if (deviceAlerts.length > 0) {
            result["is_ok"] = false;
            result["alerts"] = deviceAlerts;
            if (deviceAlerts.some((a: any) => a.severity === "critical")) {
              result["is_critical"] = false;
            } else {
              result["is_warning"] = true;
            }
          }
        }
      }
    }
  }
  ctx.body = result;
});

router.get("/api/libre/devicegroups", async (ctx) => {
  const result = await libbreApi.request("/devicegroups");
  ctx.body = result;
});

router.get("/api/libre/devicegroups/:name", async (ctx) => {
  const name = ctx.params["name"];
  const result = await libbreApi.request("/devicegroups/" + name);
  ctx.body = result;
});

router.get("/api/libre/alerts", async (ctx) => {
  const result = await libbreApi.request("/alerts");
  ctx.body = result;
});

router.get("/api/libre/locations", async (ctx) => {
  const result = await libbreApi.request("/resources/locations");
  ctx.body = result;
});
