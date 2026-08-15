import * as dotenv from "dotenv";
dotenv.config();
import { prisma } from "@/db/prisma";

import sampleData from "./sample-data";

async function main() {
  // await prisma.application.deleteMany();
  // await prisma.application.createMany({ data: sampleData.applications });
}

main();
