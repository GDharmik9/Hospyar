export type HIESystem = 'NPHIES' | 'MALAFFI' | 'NABIDH' | 'RIAYATI';

export interface HIESyncStatus {
  system: HIESystem;
  country: 'SA' | 'AE';
  connection_status: 'HEALTHY' | 'SYNCING' | 'DEGRADED' | 'DISCONNECTED';
  last_sync_timestamp: string;
  records_synchronized: number;
  compliance_regime: 'UAE_PDPL_LAW_45' | 'KSA_PDPL' | 'ADHICS';
  latency_ms: number;
}
