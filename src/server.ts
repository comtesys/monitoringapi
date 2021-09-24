if (!process.env.NODE_ENV) {
  console.log("NODE_ENV není nastaven");
} else {
  console.log("NODE_ENV je nastaven na " + process.env.NODE_ENV);
}
if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}

import Koa from "koa";
import Router from "koa-router";
import send from "koa-send";
import json from "koa-json";
const responseTime = require("koa-response-time");

import { appConfig } from "./config";
import { koaSwagger } from "koa2-swagger-ui";
import { addZabbixError } from "./infrastructure/zabbix/zabbix.statistics";

const app = new Koa();
export const router = new Router();

import "./api/zabbix.routes";
import "./api/libre.routes";

router.get("/swagger.json", async (ctx) => {
  await send(ctx, "swagger.json");
});

app.use(responseTime());
app.use(json({ pretty: true }));
app.use(router.routes());

app.use(
  koaSwagger({
    routePrefix: "/", // host at /swagger instead of default /docs
    swaggerOptions: {
      syntaxHighlight: {
        activated: false,
      },
      url: "/swagger.json", // example path to json
    },
  })
);

const bootstrap = async () => {
  const port = appConfig.PORT;
  app.listen({ port: port });
  console.log(`Started server at http://localhost:${port}`);
};

app.on("error", (err, ctx) => {
  addZabbixError();
});

bootstrap();
