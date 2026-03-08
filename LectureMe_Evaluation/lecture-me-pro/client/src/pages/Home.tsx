/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Landing Page
 * Dark Purple & Gold Theme
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { 
  Mic, 
  FileText, 
  Camera, 
  Brain, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import { SocialShare } from "@/components/SocialShare";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo-icon-simple.png" 
                alt="Lecture Me Robot" 
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <div className="text-xl font-bold text-white">Lecture Me</div>
                <div className="text-xs text-purple-300">College Edition</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      Community
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                  <span className="text-sm text-gray-300">
                    {user?.name || user?.email}
                  </span>
                </>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      Pricing
                    </Button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center space-y-8">
            {/* Robot Mascot */}
            <div className="flex justify-center mb-6">
              <img 
                src="/logo-full-detailed.png" 
                alt="Lecture Me Robot Mascot - Together We're Smarter" 
                className="w-[500px] h-auto drop-shadow-2xl animate-float"
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              Transform Your Learning with{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                AI Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Convert lectures, textbooks, and notes into perfect study materials. 
              Predict weaknesses before they happen. Learn smarter, not harder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <a href={getLoginUrl()}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl shadow-purple-500/50"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link href="/pricing">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-10 py-7 border-2 border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-white"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Free trial included</span>
              </div>
            </div>
            
            {/* Social Share */}
            <div className="pt-8 flex justify-center">
              <SocialShare variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-black/30">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <Badge className="px-4 py-2 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Zap className="w-4 h-4 mr-2 inline" />
              Revolutionary Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to give you an unfair advantage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-base text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-black/30">
        <div className="container">
          <div className="text-center space-y-4 mb-14">
            <Badge className="px-4 py-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Award className="w-4 h-4 mr-2 inline" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Path
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. All plans include core AI features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all ${
                  plan.popular 
                    ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/20 scale-105' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 shadow-lg">
                      <Star className="w-3 h-3 mr-1 inline fill-yellow-300 text-yellow-300" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl mb-3 text-white">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-5xl font-bold text-white">
                      ${plan.price}
                      <span className="text-lg font-normal text-gray-400">/month</span>
                    </div>
                    <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/pricing">
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 border-0 shadow-2xl">
            <CardContent className="py-16 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                Join thousands of students who are already learning smarter with AI
              </p>
              <a href={getLoginUrl()}>
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-black/40">
        <div className="container">
          <div className="flex flex-col gap-8">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo-icon-simple.png" 
                  alt="Lecture Me" 
                  className="w-8 h-8 rounded-lg"
                />
                <div>
                  <div className="font-bold text-white">Lecture Me</div>
                  <div className="text-xs text-purple-300">College Edition</div>
                </div>
              </div>
              
              {/* Social Share */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-400">Share with friends:</p>
                <SocialShare variant="compact" />
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-sm font-medium text-white">
                  © 2026 Charles Kendrick. All Rights Reserved.
                </div>
                <div className="flex gap-4 text-xs text-purple-300">
                  <Link href="/terms">
                    <a className="hover:text-white transition-colors">Terms of Service</a>
                  </Link>
                  <Link href="/privacy">
                    <a className="hover:text-white transition-colors">Privacy Policy</a>
                  </Link>
                  <a href="mailto:support@lectureme.org" className="hover:text-white transition-colors">Contact</a>
                </div>
                <div className="text-xs text-gray-400">
                  Lecture Me - College Edition™ · Phoenix, AZ · Proprietary Software
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Protected by US & International Copyright Law · Patent Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}

// Feature Data
const features = [
  {
    icon: Mic,
    title: "Audio Transcription",
    description: "Convert lecture recordings into searchable text with AI-powered Whisper technology. Automatic timestamps and key concept extraction."
  },
  {
    icon: FileText,
    title: "PDF Analysis",
    description: "Intelligent textbook processing that extracts definitions, formulas, and key concepts. Automatic chapter summarization."
  },
  {
    icon: Camera,
    title: "Smart Document Scanner",
    description: "Voice-guided scanning with real-time quality assessment. Perfect digitization of handwritten notes and textbooks."
  },
  {
    icon: Brain,
    title: "Weakness Prediction",
    description: "Revolutionary AI that scans your tests to predict future mistakes before they happen. Proactive learning recommendations."
  },
  {
    icon: Zap,
    title: "AI Flashcards",
    description: "Automatically generated flashcards with spaced repetition scheduling. Optimize your review sessions for maximum retention."
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Comprehensive analytics on your study sessions, performance metrics, and achievement milestones."
  }
];

// Stats Data
const stats = [
  { value: "10K+", label: "Active Students" },
  { value: "50K+", label: "Hours Transcribed" },
  { value: "95%", label: "Success Rate" },
  { value: "4.9★", label: "User Rating" }
];

// Pricing Data
const pricingPlans = [
  {
    name: "Student",
    price: 9,
    description: "Perfect for individual learners",
    popular: false,
    cta: "Start Free Trial",
    features: [
      "10 hours audio transcription/month",
      "50 PDF pages/month",
      "Basic flashcard generation",
      "Progress tracking",
      "Email support"
    ]
  },
  {
    name: "Scholar",
    price: 19,
    description: "For serious students",
    popular: true,
    cta: "Start Free Trial",
    features: [
      "25 hours audio transcription/month",
      "200 PDF pages/month",
      "Advanced flashcards with spaced repetition",
      "Weakness prediction analysis",
      "Document scanner with voice guidance",
      "Priority support"
    ]
  },
  {
    name: "Academic",
    price: 39,
    description: "Unlimited learning power",
    popular: false,
    cta: "Start Free Trial",
    features: [
      "Unlimited audio transcription",
      "Unlimited PDF processing",
      "All premium features",
      "Custom AI training",
      "Team collaboration",
      "24/7 priority support",
      "API access"
    ]
  }
];
