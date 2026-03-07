// PrismaClient is available after running `prisma generate`.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prisma: any = new PrismaClient({ adapter });
