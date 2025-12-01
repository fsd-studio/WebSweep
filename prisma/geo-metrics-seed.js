const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const companies = await prisma.company.findMany();

  const pending = companies.filter((c) => !c.geoMetrics);

  console.log(`Found ${pending.length} companies without GEO metrics.`);

  for (const company of pending) {
    const payload = [
      {
        url: company.website,
        email: company.email,
        phone: company.phone,
        city: company.city,
        canton: company.canton,
      },
    ];

    try {
      const res = await fetch("http://localhost:3000/api/geo-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const item = Array.isArray(json.items) ? json.items[0] : null;

      await prisma.company.update({
        where: { id: company.id },
        data: { geoMetrics: item },
      });

      console.log(
        `Updated company ${company.id} (${company.title || "Untitled"}) with GEO metrics.`
      );
    } catch (e) {
      console.error(
        `Failed to compute GEO metrics for company ${company.id} (${company.title || "Untitled"}):`,
        e
      );
    }

    // Be gentle with external sites and the LLM
    await sleep(15000);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
