// PrismaClient is available after running `prisma generate`.
// Prisma v7 generates the client as TypeScript in src/generated/prisma/client/
import { PrismaClient } from "../../generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
