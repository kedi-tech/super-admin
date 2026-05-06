import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { licenseKey, deviceFingerprint, deviceName } = body

    if (!licenseKey) {
      return NextResponse.json({ valid: false, error: "license_key_required" }, { status: 400 })
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"

    const license = await prisma.license.findUnique({
      where: { key: licenseKey.trim().toUpperCase() },
      include: { customer: { select: { businessName: true } } },
    })

    if (!license) {
      return NextResponse.json({ valid: false, error: "license_not_found" }, { status: 404 })
    }

    if (license.status !== "ACTIVE") {
      await prisma.licenseValidationLog.create({
        data: {
          licenseId: license.id,
          deviceId: deviceFingerprint,
          ipAddress,
          success: false,
          failureReason: `license_${license.status.toLowerCase()}`,
        },
      })
      return NextResponse.json(
        { valid: false, error: `license_${license.status.toLowerCase()}` },
        { status: 403 }
      )
    }

    // Auto-expire if past expiresAt
    if (license.expiresAt && license.expiresAt < new Date()) {
      await prisma.license.update({ where: { id: license.id }, data: { status: "EXPIRED" } })
      await prisma.licenseValidationLog.create({
        data: {
          licenseId: license.id,
          deviceId: deviceFingerprint,
          ipAddress,
          success: false,
          failureReason: "license_expired",
        },
      })
      return NextResponse.json({ valid: false, error: "license_expired" }, { status: 403 })
    }

    // Register / update device record
    if (deviceFingerprint) {
      const existing = await prisma.device.findFirst({
        where: { licenseId: license.id, fingerprint: deviceFingerprint },
      })
      if (!existing) {
        const deviceCount = await prisma.device.count({
          where: { licenseId: license.id, status: "ACTIVE" },
        })
        if (deviceCount < license.maxDevices) {
          await prisma.device.create({
            data: {
              licenseId: license.id,
              customerId: license.customerId,
              fingerprint: deviceFingerprint,
              machineName: deviceName || deviceFingerprint,
              status: "ACTIVE",
              activatedAt: new Date(),
            },
          })
        }
      } else {
        await prisma.device.update({
          where: { id: existing.id },
          data: { lastSeenAt: new Date() },
        })
      }
    }

    await prisma.licenseValidationLog.create({
      data: {
        licenseId: license.id,
        deviceId: deviceFingerprint,
        ipAddress,
        success: true,
      },
    })

    return NextResponse.json({
      valid: true,
      license: {
        id: license.id,
        key: license.key,
        type: license.type,
        status: license.status,
        maxDevices: license.maxDevices,
        maxBranches: license.maxBranches,
        maxUsers: license.maxUsers,
        expiresAt: license.expiresAt,
        customer: license.customer.businessName,
      },
    })
  } catch (err) {
    console.error("[license/validate]", err)
    return NextResponse.json({ valid: false, error: "server_error" }, { status: 500 })
  }
}
