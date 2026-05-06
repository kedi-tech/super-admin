# Phase 13 — Products & Packages Module

## What was built

- `actions/products.ts` — `getProducts`, `createProductAction`, `getPackages`, `createPackageAction`
- `app/(admin)/super-admin/products/page.tsx` — Server component with inline create sheet
- `app/(admin)/super-admin/packages/page.tsx` — Server component with inline create sheet
- `components/packages/create-package-sheet.tsx` — Sheet form: name, product select, billing cycle, price, currency, maxDevices, maxBranches, maxUsers
- Products show: name, type (CLOUD/HYBRID/OFFLINE/ECOMMERCE/COMMERCE_SUITE), description, active status
- Packages show: name, product, billing cycle, price, device/branch/user limits, status
