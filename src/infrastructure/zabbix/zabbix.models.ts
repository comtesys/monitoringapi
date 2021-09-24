import { threadId } from "worker_threads";

export interface ZabbixResult {
  maintenance_status: string;
  status: ZabbixStatusResult;
  statusDescription: string;
  acknowledged: string;
  description: string;
  host: string;
  service: string;
  is_unknown: boolean;
  is_ok: boolean;
  is_warning: boolean;
  is_error: boolean;
  is_critical: boolean;
  trigger: any;
}

export class ZabbixResult implements ZabbixResult {
  maintenance_status: string = "";
  status: ZabbixStatusResult = null;
  statusDescription: string = "";
  acknowledged: string = "";
  description: string = "";
  host: string = "";
  service: string = "";
  is_unknown: boolean = false;
  is_ok: boolean = false;
  is_warning: boolean = false;
  is_error: boolean = false;
  is_critical: boolean = false;

  constructor(init?: Partial<ZabbixResult>, problem?: ZabbixProblem, trigger?: ZabbixTrigger) {
    Object.assign(this, init);
    if (trigger) {
      this.description = trigger.description;
    }
    if (this.is_ok) {
      this.setOk();
    }
    if (this.is_unknown) {
      this.setUnknown();
    }
    if (this.is_error) {
      this.setError();
    }
    if (this.is_critical) {
      this.setCritical();
    }
    if (this.is_warning) {
      this.setWarning();
    }

    if (problem) {
      this.acknowledged = problem.acknowledged;

      //@ts-ignore
      if (problem.severity === 0 || problem.severity === "0") {
        this.setUnknown();
      }

      //@ts-ignore
      if (problem.severity === 1 || problem.severity === "1") {
        this.setOk();
      }

      //@ts-ignore
      if (problem.severity === 2 || problem.severity === "2") {
        this.setWarning();
      }

      //@ts-ignore
      if (problem.severity === 3 || problem.severity === "3") {
        this.setError();
      }

      //@ts-ignore
      if (problem.severity === 4 || problem.severity === "4") {
        this.setCritical();
      }

      //@ts-ignore
      if (problem.severity === 5 || problem.severity === "5") {
        this.setCritical();
      }
    }
  }

  setOk() {
    this.is_ok = true;
    this.status = ZabbixStatusResult.Ok;
    this.statusDescription = ZabbixStatusResult[ZabbixStatusResult.Ok];
  }
  setUnknown() {
    this.is_unknown = true;
    this.status = ZabbixStatusResult.Unknown;
    this.statusDescription = ZabbixStatusResult[ZabbixStatusResult.Unknown];
  }
  setWarning() {
    this.is_warning = true;
    this.status = ZabbixStatusResult.Warning;
    this.statusDescription = ZabbixStatusResult[ZabbixStatusResult.Warning];
  }
  setError() {
    this.is_error = true;
    this.status = ZabbixStatusResult.Error;
    this.statusDescription = ZabbixStatusResult[ZabbixStatusResult.Error];
  }
  setCritical() {
    this.is_critical = true;
    this.status = ZabbixStatusResult.Critical;
    this.statusDescription = ZabbixStatusResult[ZabbixStatusResult.Critical];
  }
}

export enum ZabbixStatusResult {
  Unknown = 1,
  Ok = 2,
  Warning = 3,
  Error = 4,
  Critical = 5,
}

export interface ZabbixExtendedHost {
  hostid: string;
  proxy_hostid: string;
  host: string;
  status: string;
  disable_until: string;
  error: string;
  available: string;
  errors_from: string;
  lastaccess: string;
  ipmi_authtype: string;
  ipmi_privilege: string;
  ipmi_username: string;
  ipmi_password: string;
  ipmi_disable_until: string;
  ipmi_available: string;
  snmp_disable_until: string;
  snmp_available: string;
  maintenanceid: string;
  maintenance_status: string;
  maintenance_type: string;
  maintenance_from: string;
  ipmi_errors_from: string;
  snmp_errors_from: string;
  ipmi_error: string;
  snmp_error: string;
  jmx_disable_until: string;
  jmx_available: string;
  jmx_errors_from: string;
  jmx_error: string;
  name: string;
  flags: string;
  templateid: string;
  description: string;
  tls_connect: string;
  tls_accept: string;
  tls_issuer: string;
  tls_subject: string;
  tls_psk_identity: string;
  tls_psk: string;
  proxy_address: string;
  auto_compress: string;
  items: ZabbixItem[];
  triggers: ZabbixTrigger[];
}

export interface ZabbixProblem {
  eventid: string;
  source: string;
  object: string;
  objectid: string;
  clock: string;
  ns: string;
  r_eventid: string;
  r_clock: string;
  r_ns: string;
  correlationid: string;
  userid: string;
  name: string;
  acknowledged: string;
  severity: number;
  suppressed: number;
}

export interface ZabbixItem {
  itemid: string;
  type: string;
  snmp_community: string;
  snmp_oid: string;
  hostid: string;
  name: string;
  key_: string;
  delay: string;
  history: string;
  trends: string;
  status: string;
  value_type: string;
  trapper_hosts: string;
  units: string;
  snmpv3_securityname: string;
  snmpv3_securitylevel: string;
  snmpv3_authpassphrase: string;
  snmpv3_privpassphrase: string;
  formula: string;
  error: string;
  lastlogsize: string;
  logtimefmt: string;
  templateid: string;
  valuemapid: string;
  params: string;
  ipmi_sensor: string;
  authtype: string;
  username: string;
  password: string;
  publickey: string;
  privatekey: string;
  mtime: string;
  flags: string;
  interfaceid: string;
  port: string;
  description: string;
  inventory_link: string;
  lifetime: string;
  snmpv3_authprotocol: string;
  snmpv3_privprotocol: string;
  state: string;
  snmpv3_contextname: string;
  evaltype: string;
  jmx_endpoint: string;
  master_itemid: string;
  timeout: string;
  url: string;
  query_fields: any[];
  posts: string;
  status_codes: string;
  follow_redirects: string;
  post_type: string;
  http_proxy: string;
  headers: any[];
  retrieve_mode: string;
  request_method: string;
  output_format: string;
  ssl_cert_file: string;
  ssl_key_file: string;
  ssl_key_password: string;
  verify_peer: string;
  verify_host: string;
  allow_traps: string;
  hosts: ZabbixExtendedHost[];
  lastclock: string;
  lastns: string;
  lastvalue: string;
  prevvalue: string;
}

export interface ZabbixTrigger {
  triggerid: string;
  expression: string;
  description: string;
  url: string;
  status: string;
  value: string;
  priority: string;
  lastchange: string;
  comments: string;
  error: string;
  templateid: string;
  type: string;
  state: string;
  flags: string;
  recovery_mode: string;
  recovery_expression: string;
  correlation_mode: string;
  correlation_tag: string;
  manual_close: string;
  hosts: ZabbixExtendedHost[];
  items: ZabbixExtendedItem[];
}

export interface ZabbixExtendedHost {
  hostid: string;
  name: string;
  maintenance_status: string;
}

export interface ZabbixExtendedItem {
  itemid: string;
  name: string;
}
export interface ZabbixHostsWithItemsAndTriggers {
  hostid: string;
  proxy_hostid: string;
  host: string;
  status: string;
  disable_until: string;
  error: string;
  available: string;
  errors_from: string;
  lastaccess: string;
  ipmi_authtype: string;
  ipmi_privilege: string;
  ipmi_username: string;
  ipmi_password: string;
  ipmi_disable_until: string;
  ipmi_available: string;
  snmp_disable_until: string;
  snmp_available: string;
  maintenanceid: string;
  maintenance_status: string;
  maintenance_type: string;
  maintenance_from: string;
  ipmi_errors_from: string;
  snmp_errors_from: string;
  ipmi_error: string;
  snmp_error: string;
  jmx_disable_until: string;
  jmx_available: string;
  jmx_errors_from: string;
  jmx_error: string;
  name: string;
  flags: string;
  templateid: string;
  description: string;
  tls_connect: string;
  tls_accept: string;
  tls_issuer: string;
  tls_subject: string;
  tls_psk_identity: string;
  tls_psk: string;
  proxy_address: string;
  auto_compress: string;
  items: ZabbixItem[];
  triggers: ZabbixTrigger[];
}
