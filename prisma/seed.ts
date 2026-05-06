import { config } from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Seed products
  const products = [
    { name: "Cloud POS", slug: "CLOUD_POS" as const, description: "Cloud-based point of sale system" },
    { name: "Hybrid POS", slug: "HYBRID_POS" as const, description: "Online + offline capable POS" },
    { name: "Offline POS", slug: "OFFLINE_POS" as const, description: "Fully offline desktop POS" },
    { name: "E-Commerce", slug: "ECOMMERCE" as const, description: "Online store platform" },
    { name: "Commerce Suite", slug: "COMMERCE_SUITE" as const, description: "Full commerce suite (POS + E-Commerce)" },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }

  // Seed default super admin
  const passwordHash = await bcrypt.hash("admin123!", 12)
  await prisma.adminUser.upsert({
    where: { email: "admin@keditech.com" },
    update: {},
    create: {
      email: "admin@keditech.com",
      name: "KediTech Super Admin",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })

  console.log("✅ Seed complete")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
