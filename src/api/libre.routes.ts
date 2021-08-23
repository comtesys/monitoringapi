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
