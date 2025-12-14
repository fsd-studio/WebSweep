'use server';

import { PrismaClient } from "../../../generated/prisma/client.js" // or "../app/generated/prisma/client" depending on your output
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const globalForPrisma = globalThis._prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalThis._prisma = globalForPrisma;
}

const prisma = globalForPrisma;

/**
 * @typedef {object} Website
 * @property {number} id - Unique identifier from the database.
 * @property {string} name - The name of the website.
 * @property {string} url - The URL of the website.
 * @property {string} [category] - The website category.
 * @property {string} [city] - The city of the website.
 * @property {string} [canton] - The canton (region) of the website.
 * // Note: Other fields corresponding to scores (geo, seo, etc.) are assumed to be present.
 */

/**
 * @typedef {object} Filters
 * @property {string} [category] - Category search term.
 * @property {string} [city] - City search term.
 * @property {string} [canton] - Canton search term.
 */

/**
 * Searches the database for websites matching the provided criteria using Prisma.
 * This function runs entirely on the server.
 * * @param {Filters} filters - The search criteria object.
 * @returns {Promise<Website[]>} The list of matching websites.
 */
export async function searchWebsites(filters) {
  const { category, city, canton } = filters;
  
  // Build the WHERE clause for Prisma to filter the database records
  const where = {};
  
  // Apply filters with case-insensitive search (`mode: 'insensitive'`)
  if (category) {
    where.category = { contains: category, mode: 'insensitive' };
  }
  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }
  if (canton) {
    where.canton = { contains: canton, mode: 'insensitive' };
  }

  try {
    // Query the `website` model with the constructed filter
    const websites = await prisma.company.findMany({
      where: where,
    });

    return websites;

  } catch (error) {
    console.error('Database query error in Server Action:', error);
    // Propagate a generic error message to the client for safe error handling
    throw new Error('Failed to fetch websites from the database.');
  }
}