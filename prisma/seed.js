import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
  const companies = JSON.parse(
    fs.readFileSync('./prisma/seed-dataset-websweep.json', 'utf-8')
  )

  await prisma.company.createMany({
    data: companies,
  })

  console.log(`Seeded ${companies.length} companies from JSON file!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })