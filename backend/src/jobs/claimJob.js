const cron = require("node-cron");
const prisma = require("../lib/prisma");

const generateClaims = async () => {
  const workers = await prisma.worker.findMany();

  for (const worker of workers) {
    const randomChance = Math.random();

    // 20% chance of disruption
    if (randomChance < 0.2) {
      const claim = await prisma.claim.create({
        data: {
          workerId: worker.id,
          disruptionType: "Weather Disruption",
          zone: worker.city,
          amount: Math.floor(Math.random() * 500 + 100),
          status: "APPROVED"
        }
      });

      console.log("Claim generated:", claim.id);
    }
  }
};

// runs every 1 minute
cron.schedule("* * * * *", generateClaims);