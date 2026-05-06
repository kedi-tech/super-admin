import { SignJWT, importPKCS8, importSPKI } from "jose"
import { randomUUID } from "crypto"

export function generateLicenseKey(): string {
  const raw = randomUUID().replace(/-/g, "").toUpperCase()
  return [
    raw.slice(0, 4),
    raw.slice(4, 8),
    raw.slice(8, 12),
    raw.slice(12, 16),
    raw.slice(16, 20),
    raw.slice(20, 24),
  ].join("-")
}

export interface OfflineLicensePayload {
  licenseKey: string
  customerId: string
  businessName: string
  productType: string
  issuedAt: string
  expiresAt: string | null
  maxDevices: number
  maxBranches: number
  maxUsers: number
  gracePeriodDays: number
  offlineGraceRules: {
    validateEveryDays: number
    maxOfflineDays: number
  }
}

export async function signOfflineLicense(
  payload: OfflineLicensePayload,
  privateKeyPem: string
): Promise<string> {
  const privateKey = await importPKCS8(privateKeyPem, "RS256")
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setIssuer("KediTech-SuperAdmin")
    .setSubject(payload.licenseKey)
    .sign(privateKey)
  return token
}

export async function verifyOfflineLicense(
  token: string,
  publicKeyPem: string
): Promise<OfflineLicensePayload> {
  const { jwtVerify } = await import("jose")
  const publicKey = await importSPKI(publicKeyPem, "RS256")
  const { payload } = await jwtVerify(token, publicKey, {
    issuer: "KediTech-SuperAdmin",
  })
  return payload as unknown as OfflineLicensePayload
}
