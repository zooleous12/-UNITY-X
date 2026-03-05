import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { 
  Sparkles, 
  Mic, 
  FileText, 
  Camera, 
  Brain, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Star,
  TrendingUp,
  Target,
  Award
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Lecture Me</span>
              <span className="text-sm ml-2 text-gray-600">College Edition</span>
            </div>
            
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {user?.name || user?.email}
                  </span>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button variant="ghost">Sign In</Button>
                  </a>
                  <a href={getLoginUrl()}>
                    <Button className="bg-primary hover:bg-primary/90">
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
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI-Powered Study Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your Learning with{" "}
              <span className="text-gradient">AI Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Convert lectures, textbooks, and notes into perfect study materials. 
              Predict weaknesses before they happen. Learn smarter, not harder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Free trial included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2 inline" />
              Revolutionary Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to give you an unfair advantage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-premium group hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="px-4 py-2">
              <Award className="w-4 h-4 mr-2 inline" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Choose Your <span className="text-gradient">Learning Path</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you're ready. All plans include core AI features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative ${
                  plan.popular 
                    ? 'border-primary shadow-2xl scale-105' 
                    : 'card-premium'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-3 h-3 mr-1 inline" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold">
                      ${plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a href={getLoginUrl()} className="block">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="card-premium bg-gradient-to-br from-primary/10 via-accent/10 to-background border-primary/20">
            <CardContent className="py-16 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students who are already learning smarter with AI
              </p>
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gradient">Lecture Me</span>
              <span className="text-sm ml-1">College Edition</span>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-1">
              <div className="text-sm font-medium text-foreground">
                © 2026 Charles Kendrick. All Rights Reserved.
              </div>
              <div className="text-xs text-muted-foreground">
                Lecture Me - College Edition™ · Phoenix, AZ · Proprietary Software
              </div>
              <div className="text-[8px] text-muted-foreground/50 font-mono">
                Protected by US & International Copyright Law · Patent Pending
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
