export const appConfig = {
  ZABBIX_URL: process.env.ZABBIX_URL || "http://zabbix.dpp.cz/api_jsonrpc.php",
  LIBRE_URL: process.env.LIBRE_URL || "http://librenms.dpp.cz/api/v0",
  ZABBIX_TOKEN:
    process.env.ZABBIX_TOKEN ||
    "f2bb7fa9d25fadb50f66b15fac72204f4d668290f3bf6449845c253299e671c7",
  LIBRE_TOKEN: process.env.LIBRE_TOKEN || "5c9824807432821329c801d3f16843e1",
  PORT: process.env.PORT || "3000",
  USE_CACHE: process.env.USE_CACHE || false,
  CACHE_INTERVAL_SECONDS: process.env.CACHE_INTERVAL_SECONDS || 180,
};
