import { z } from "zod";

/** Canonical evidence object */
export const EvidenceStr = z.object({
  value: z.string().nullable(),
  evidence: z.array(z.string()).default([]),
});

/** Flexible input: object | string | null → coerced to EvidenceStr */
export const EvidenceFlexible = z
  .union([EvidenceStr, z.string(), z.null()])
  .transform((v) =>
    v === null
      ? { value: null, evidence: [] }
      : typeof v === "string"
      ? { value: v, evidence: [] }
      : v
  );

// ---------------- Page ----------------
export const PageSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  text: z.string().min(30),
  tags: z.array(z.string()).optional(),
  domain: z.string().optional(),
});

// ------------- Extraction (STRICT) -------------
export const ExtractionSchema = z
  .object({
    faqs: z
      .array(
        z.object({
          q: EvidenceFlexible,
          a: EvidenceFlexible,
        })
      )
      .default([]),

    goal: EvidenceFlexible,
    mission: EvidenceFlexible,
    vision: EvidenceFlexible,

    address: z.object({
      street: EvidenceFlexible,
      postal_code: EvidenceFlexible,
      city: EvidenceFlexible,
      country: EvidenceFlexible,
    }),

    contact: z.object({
      email: EvidenceFlexible,
      phone: EvidenceFlexible,
    }),

    services: z.array(EvidenceFlexible).default([]),
  })
  .strict();

// ------------- Evaluation (STRICT) -------------
export const EvalSchema = z
  .object({
    // inside EvalSchema
    scores: z.object({
      relevance: z.object({
        score: z.number().min(1).max(10),
        reason: z.string().max(120),
      }),
      support: z.object({
        score: z.number().min(1).max(10),
        reason: z.string().max(120),
      }),
      completeness: z.object({
        score: z.number().min(1).max(10),
        reason: z.string().max(120),
      }),
      citation_quality: z.object({
        score: z.number().min(1).max(10),
        reason: z.string().max(120),
      }),
      uniqueness: z.object({
        score: z.number().min(1).max(10),
        reason: z.string().max(120),
      }),
    }),
    overall: z.object({
      score: z.number().min(0).max(100),
      reason: z.string().max(160),
    }),

    field_feedback: z
      .object({
        goal: z.string().optional(),
        vision: z.string().optional(),
        address: z.string().optional(),
        faqs: z.string().optional(),
      })
      .optional(),
  })
  .strict();

