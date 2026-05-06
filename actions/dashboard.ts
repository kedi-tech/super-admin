"use server"

import { prisma } from "@/lib/prisma"
import type { DashboardStats } from "@/types"
import { subDays } from "date-fns"

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      totalCustomers,
      activeSubscriptions,
      expiredSubscriptions,
      activeLicenses,
      activeDevices,
      openTickets,
      failedValidations,
      revenueAgg,
      mrrAgg,
      cloudCustomers,
      hybridCustomers,
      offlineCustomers,
      ecommerceCustomers,
      commerceSuiteCustomers,
      pendingRenewals,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "EXPIRED" } }),
      prisma.license.count({ where: { status: "ACTIVE" } }),
      prisma.device.count({ where: { status: "ACTIVE" } }),
      prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
      prisma.licenseValidationLog.count({
        where: { success: false, validatedAt: { gte: subDays(new Date(), 7) } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "VERIFIED" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "VERIFIED",
          subscription: { billingCycle: "MONTHLY", status: "ACTIVE" },
        },
      }),
      // Customers per product type by counting licenses
      prisma.customer.count({
        where: { licenses: { some: { type: { in: ["CLOUD_SUBSCRIPTION", "CLOUD_LIFETIME"] } } } },
      }),
      prisma.customer.count({
        where: { licenses: { some: { type: { in: ["HYBRID_SUBSCRIPTION", "HYBRID_LIFETIME"] } } } },
      }),
      prisma.customer.count({
        where: { licenses: { some: { type: { in: ["OFFLINE_SUBSCRIPTION", "OFFLINE_LIFETIME"] } } } },
      }),
      prisma.customer.count({
        where: { licenses: { some: { type: { in: ["ECOMMERCE_SUBSCRIPTION", "ECOMMERCE_LIFETIME"] } } } },
      }),
      prisma.customer.count({
        where: { licenses: { some: { type: { in: ["COMMERCE_SUITE_SUBSCRIPTION", "COMMERCE_SUITE_LIFETIME"] } } } },
      }),
      prisma.subscription.count({
        where: {
          status: "ACTIVE",
          renewalDate: { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ])

    return {
      totalCustomers,
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue: revenueAgg._sum.amount ?? 0,
      mrr: mrrAgg._sum.amount ?? 0,
      activeLicenses,
      activeDevices,
      openTickets,
      failedValidations,
      pendingRenewals,
      cloudCustomers,
      hybridCustomers,
      offlineCustomers,
      ecommerceCustomers,
      commerceSuiteCustomers,
    }
  } catch {
    // Return zeros when DB not configured yet
    return {
      totalCustomers: 0, activeSubscriptions: 0, expiredSubscriptions: 0,
      totalRevenue: 0, mrr: 0, activeLicenses: 0, activeDevices: 0,
      openTickets: 0, failedValidations: 0, pendingRenewals: 0,
      cloudCustomers: 0, hybridCustomers: 0, offlineCustomers: 0,
      ecommerceCustomers: 0, commerceSuiteCustomers: 0,
    }
  }
}

export async function getRevenueChartData() {
  try {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (11 - i))
      return d
    })

    const data = await Promise.all(
      months.map(async (date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1)
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
        const agg = await prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: "VERIFIED", paidAt: { gte: start, lte: end } },
        })
        return {
          month: date.toLocaleString("en-US", { month: "short" }),
          revenue: (agg._sum.amount ?? 0) / 100,
        }
      })
    )
    return data
  } catch {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(new Date().setMonth(new Date().getMonth() - (11 - i))).toLocaleString("en-US", { month: "short" }),
      revenue: 0,
    }))
  }
}

export async function getRecentPayments() {
  try {
    return await prisma.payment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    })
  } catch {
    return []
  }
}

export async function getRecentTickets() {
  try {
    return await prisma.supportTicket.findMany({
      take: 5,
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    })
  } catch {
    return []
  }
}
