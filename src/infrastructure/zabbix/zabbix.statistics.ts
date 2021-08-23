let errors = 0;
let zabbixHits = 0;
let zabbixCacheHits = 0;

export const addZabbixError = () => {
  errors++;
};

export const addZabbixHits = () => {
  zabbixHits++;
};

export const addZabbixCacheHits = () => {
  zabbixCacheHits++;
};

export const getZabbixStatistics = () => {
  return {
    errors,
    zabbixHits,
    zabbixCacheHits
  };
};
