/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Stripe Products Configuration
 * AUTO-GENERATED: 2026-01-07T01:48:00.435Z
 */

export const PRODUCTS = {
  STUDENT: {
    name: "Student (Basic)",
    priceId: "price_1SmlqrDP7yrrCzjDPj8DOTkV",
    price: 900, // $9.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "Audio lecture processing",
      "PDF processing",
      "Basic study guides",
      "Flashcards",
      "10 hours/month",
      "Email support",
    ],
  },
  SCHOLAR: {
    name: "Scholar (Mid)",
    priceId: "price_1SmlqsDP7yrrCzjDtrtD6khF",
    price: 1900, // $19.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "Everything in Student +",
      "Professor style recognition",
      "Textbook-lecture synthesis",
      "Multi-language support",
      "25 hours/month",
      "Priority support",
      "Advanced analytics",
    ],
  },
  ACADEMIC_PASS: {
    name: "Lecture Me Academic Pass",
    priceId: "price_1SmlquDP7yrrCzjDyjtpQcXq",
    price: 3900, // $39.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "AI study guide generation",
      "Audio lecture processing",
      "Textbook synthesis",
      "Flashcards with SM-2 algorithm",
      "Analytics dashboard",
      "Exam prediction",
      "Unlimited processing",
      "Cancel anytime",
    ],
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
