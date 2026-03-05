/**
 * Copyright (c) 2026 Charles Kendrick
 * All Rights Reserved.
 * 
 * Lecture Me - College Edition™ - Pricing Page
 * Phoenix, AZ | lectureme.app@gmail.com
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

export default function Pricing() {
  const [, setLocation] = useLocation();

  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const createCheckout = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error("Checkout Error", {
        description: error.message || "Failed to create checkout session",
      });
      setLoadingPriceId(null);
    },
  });

  const handleSubscribe = (productKey: "STUDENT" | "SCHOLAR" | "ACADEMIC_PASS") => {
    setLoadingPriceId(productKey);
    createCheckout.mutate({ productKey });
  };

  const tiers = [
    {
      name: "Student",
      subtitle: "Basic",
      price: "$9",
      period: "/month",
      description: "Perfect for individual students getting started",
      productKey: "STUDENT" as const,
      icon: Sparkles,
      features: [
        "Audio transcription (5 hours/month)",
        "PDF analysis (10 documents/month)",
        "AI flashcard generation",
        "Basic study guides",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Scholar",
      subtitle: "Mid-Tier",
      price: "$19",
      period: "/month",
      description: "For serious students who need more power",
      productKey: "SCHOLAR" as const,
      icon: Zap,
      features: [
        "Audio transcription (15 hours/month)",
        "PDF analysis (30 documents/month)",
        "Advanced flashcard algorithms",
        "Detailed study guides",
        "Weakness analysis",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Academic Pass",
      subtitle: "Premium",
      price: "$39",
      period: "/month",
      description: "Unlimited everything for power users",
      productKey: "ACADEMIC_PASS" as const,
      icon: Crown,
      features: [
        "Unlimited audio transcription",
        "Unlimited PDF analysis",
        "Advanced AI study guides",
        "Proactive weakness detection",
        "Course management tools",
        "Test tracking & analytics",
        "24/7 priority support",
      ],
      popular: false,
      badge: "$1 First Month",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-amber-50 dark:from-purple-950 dark:via-gray-900 dark:to-amber-950">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
            <img src="/logo.png" alt="Lecture Me" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
              Lecture Me
            </span>
          </div>
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-purple-500 to-amber-600 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your learning with AI-powered study tools. Start with a plan that fits your needs.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isLoading = loadingPriceId === tier.productKey;

            return (
              <Card
                key={tier.productKey}
                className={`relative ${
                  tier.popular
                    ? "border-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                    : "border-gray-200 dark:border-gray-800"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {tier.badge}
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      tier.popular
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        tier.popular
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.subtitle}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">{tier.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{tier.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      tier.popular
                        ? "bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                        : ""
                    }`}
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(tier.productKey)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Subscribe Now"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Note */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All plans include a 7-day free trial. Cancel anytime. Questions?{" "}
            <a href="mailto:lectureme.app@gmail.com" className="text-purple-600 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2026 Charles Kendrick. All Rights Reserved.</p>
          <p className="mt-1">Lecture Me - College Edition™ | Phoenix, AZ | Patent Pending</p>
        </div>
      </footer>
    </div>
  );
}
