'use server';

// The import path you provided, adjusted to standard ES module practice:
import { PrismaClient } from "../../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Prisma Client Initialization (using the standard caching pattern)
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis;

// Initialize or retrieve the cached instance
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// Cache the instance only in development mode (prevents excessive connections during HMR)
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

/**
 * Retrieves a single Company record from the database by its primary key ID.
 * @param {number} id - The ID of the company to retrieve.
 * @returns {Promise<object | null>} The Company object or null if not found.
 */
export async function getCompanyById(id) {
    // Ensure the ID is a valid number
    if (typeof id !== 'number' || isNaN(id)) {
        console.error('Invalid ID provided to getCompanyById:', id);
        return null;
    }

    try {
        // Use findUnique to fetch the record by ID
        const company = await prisma.company.findUnique({
            where: {
                id: id,
            },
        });

        // Prisma returns null if the record is not found
        return company;
    } catch (error) {
        console.error(`Database query error in getCompanyById for ID ${id}:`, error);
        // Throw a generic error to the client
        throw new Error('Failed to retrieve company data.');
    }
}