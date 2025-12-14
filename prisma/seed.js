import { PrismaClient } from "../generated/prisma/client.js" // or "../app/generated/prisma/client" depending on your output
import { PrismaPg } from "@prisma/adapter-pg"
import fs from "fs"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const companies = JSON.parse(
    fs.readFileSync("./prisma/seed-dataset-websweep.json", "utf-8")
  );

  await prisma.company.createMany({
    data: companies,
  });

  console.log(`Seeded ${companies.length} companies from JSON file!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
