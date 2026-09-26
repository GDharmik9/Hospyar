/**
 * Checksum & Data Integrity Contracts
 * Aligned with UAE PDPL Federal Decree-Law No. 45 & Saudi Arabia PDPL
 */

export interface ChecksumManifest {
  version: string;
  algorithm: "SHA-256";
  generated_at: string;
  governance: string;
  files: Record<string, string>;
}

export interface ChecksumVerificationReport {
  is_valid: boolean;
  algorithm: "SHA-256";
  total_files_checked: number;
  mismatches: Array<{
    file: string;
    expected_hash: string;
    actual_hash: string;
  }>;
}

export interface RecordIntegrityHeader {
  record_id: string;
  algorithm: "SHA-256";
  checksum: string;
  hmac_signature: string;
  sovereign_boundary: string;
}
