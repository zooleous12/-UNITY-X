/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * Stripe Product & Pricing Configuration
 * 
 * This file contains proprietary pricing strategy and product definitions.
 * 
 * For licensing inquiries: lectureme.app@gmail.com
 */

/**
 * NOTICE: This is a placeholder file for the public GitHub repository.
 * The actual pricing strategy, product tiers, and Stripe configuration
 * have been removed to protect business strategy.
 * 
 * The production version includes:
 * - Multi-tier subscription pricing (Monthly, Semester, Academic Year)
 * - Strategic pricing optimization for college students
 * - Promotional pricing and discount strategies
 * - Stripe product/price ID mappings
 * 
 * Contact lectureme.app@gmail.com for partnership or licensing opportunities.
 */

export const PRODUCTS = {
  MONTHLY_PASS: {
    key: "MONTHLY_PASS",
    name: "Monthly Pass",
    description: "Access for one month",
    price: 0, // Placeholder
    stripePriceId: "price_placeholder",
    stripeProductId: "prod_placeholder",
  },
  SEMESTER_PASS: {
    key: "SEMESTER_PASS",
    name: "Semester Pass",
    description: "Access for one semester",
    price: 0, // Placeholder
    stripePriceId: "price_placeholder",
    stripeProductId: "prod_placeholder",
  },
  ACADEMIC_PASS: {
    key: "ACADEMIC_PASS",
    name: "Academic Year Pass",
    description: "Access for full academic year",
    price: 0, // Placeholder
    stripePriceId: "price_placeholder",
    stripeProductId: "prod_placeholder",
  },
};

export type ProductKey = keyof typeof PRODUCTS;
