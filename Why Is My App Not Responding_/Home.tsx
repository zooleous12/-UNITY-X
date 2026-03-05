/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * Lecture Me - College Edition - Landing Page
 * Dark Purple & Gold Theme - Enhanced Edition
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
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
  BarChart3,
  Sparkles,
  GraduationCap,
  BookOpen,
  Shield
} from "lucide-react";
import { Link } from "wouter";
import { SocialShare } from "@/components/SocialShare";

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663256154508";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0118] text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[140px] animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/[0.06]">
        <div className="backdrop-blur-2xl bg-black/40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/40 rounded-xl blur-md" />
                  <img 
                    src={`${CDN}/bhPQAMXJgbaCBlpR.png`}
                    alt="Lecture Me Robot" 
                    className="relative w-10 h-10 rounded-xl ring-1 ring-white/20"
                  />
                </div>
                <div>
                  <div className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Lecture Me</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-purple-400 font-medium">College Edition</div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                        <BarChart3 className="w-4 h-4 mr-1.5" />
                        Analytics
                      </Button>
                    </Link>
                    <Link href="/community">
                      <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                        Community
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="ml-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <span className="text-sm text-purple-200 font-medium">
                        {user?.name || user?.email}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/pricing">
                      <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                        Pricing
                      </Button>
                    </Link>
                    <a href={getLoginUrl()}>
                      <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 text-sm">
                        Sign In
                      </Button>
                    </a>
                    <a href={getLoginUrl()}>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105">
                        Get Started <ArrowRight className="ml-1.5 w-4 h-4" />
                      </Button>
                    </a>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            {/* Robot Mascot with glow */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-center mb-10"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
                <div className="relative bg-white/95 rounded-2xl p-1 shadow-2xl shadow-purple-500/20 ring-1 ring-white/20">
                  <img 
                    src={`${CDN}/iGxWhOmYPdtEKegq.png`}
                    alt="Lecture Me Robot Mascot - Together We're Smarter" 
                    className="w-[340px] h-auto rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="px-4 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 backdrop-blur-sm mb-6">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                  AI-Powered Study Platform
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeUp} custom={1}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
              >
                Transform Your{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                    Learning
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 rounded-full opacity-60" />
                </span>
                <br />
                <span className="text-white/90">with AI Intelligence</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeUp} custom={2}
                className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
              >
                Convert lectures, textbooks, and notes into study guides, flashcards, and Q&A sessions. 
                Predict weaknesses before they happen. Learn smarter, not harder.
              </motion.p>
              
              <motion.div 
                variants={fadeUp} custom={3}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <a href={getLoginUrl()}>
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-2xl shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-105 rounded-xl"
                  >
                    <GraduationCap className="mr-2 w-5 h-5" />
                    Start Learning Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base px-8 py-6 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 rounded-xl backdrop-blur-sm bg-white/[0.02]"
                  >
                    View Pricing
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeUp} custom={4}
                className="flex items-center justify-center gap-8 pt-4 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Free trial included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Secure & Private</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
        <div className="container relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-4 mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="px-4 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
                Revolutionary Features
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Excel
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-400 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to give you an unfair advantage
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={index}
              >
                <Card 
                  className="h-full bg-white/[0.03] border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-500 group cursor-default"
                >
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                    <CardTitle className="text-lg text-white/90 group-hover:text-white transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeUp}
                custom={index}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm font-medium tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
        <div className="container relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge className="px-4 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Award className="w-3.5 h-3.5 mr-1.5 inline" />
                Simple Pricing
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-bold">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Path
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-gray-400 max-w-2xl mx-auto">
              Start free, upgrade when you're ready. All plans include core AI features.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={index}
              >
                <Card 
                  className={`relative h-full bg-white/[0.03] border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-500 ${
                    plan.popular 
                      ? 'border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.15)] scale-[1.02]' 
                      : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 shadow-lg shadow-purple-500/30 border-0">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="text-xl mb-3 text-white/90">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-white">
                        ${plan.price}
                        <span className="text-base font-normal text-gray-500">/month</span>
                      </div>
                      <CardDescription className="text-gray-500">{plan.description}</CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href="/pricing">
                      <Button 
                        className={`w-full rounded-xl ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25' 
                            : 'bg-white/[0.06] hover:bg-white/10 text-white border border-white/10'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600/80 via-purple-700/80 to-pink-700/80 border-0 backdrop-blur-xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-[60px]" />
              
              <CardContent className="relative py-16 md:py-20 text-center space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
                  Join thousands of students who are already learning smarter with AI
                </p>
                <div className="pt-2">
                  <a href={getLoginUrl()}>
                    <Button 
                      size="lg" 
                      className="text-base px-10 py-6 bg-white text-purple-700 hover:bg-gray-100 shadow-xl shadow-black/20 rounded-xl font-semibold transition-all hover:scale-105"
                    >
                      Get Started for Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] py-10">
        <div className="absolute inset-0 bg-black/40" />
        <div className="container relative">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-lg blur-sm" />
                  <img 
                    src={`${CDN}/bhPQAMXJgbaCBlpR.png`}
                    alt="Lecture Me" 
                    className="relative w-8 h-8 rounded-lg"
                  />
                </div>
                <div>
                  <div className="font-bold text-white/90">Lecture Me</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-purple-400">College Edition</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-gray-600">Share with friends</p>
                <SocialShare variant="compact" />
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="text-sm font-medium text-white/80">
                  © 2026 Charles Kendrick. All Rights Reserved.
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <Link href="/terms">
                    <span className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</span>
                  </Link>
                  <Link href="/privacy">
                    <span className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</span>
                  </Link>
                  <a href="mailto:support@lectureme.org" className="hover:text-purple-400 transition-colors">Contact</a>
                </div>
                <div className="text-xs text-gray-600">
                  Lecture Me - College Edition™ · Phoenix, AZ · Proprietary Software
                </div>
                <div className="text-[10px] text-gray-700 font-mono">
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
