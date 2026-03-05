/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - College Edition - Founder Analytics Dashboard
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, Users, Lightbulb, TrendingUp } from "lucide-react";

export default function FounderAnalytics() {
  const { user } = useAuth();
  const { data: founders } = trpc.founderAnalytics.getAllFounders.useQuery();
  const { data: suggestions } = trpc.founderAnalytics.getAllSuggestions.useQuery();
  const { data: featureAdoption } = trpc.founderAnalytics.getFeatureAdoption.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Founder Analytics</h1>
                <p className="text-sm text-muted-foreground">Monitor founder activity and feedback</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Founders</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{founders?.filter(f => f.userTier === "founder_core").length || 0}/10</div>
              <p className="text-xs text-muted-foreground">Lifetime free seats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beta Testers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{founders?.filter(f => f.userTier === "beta_tester").length || 0}/20</div>
              <p className="text-xs text-muted-foreground">1 year free after 1000 users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suggestions</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suggestions?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Feature requests submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Founders List */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>All Founders & Beta Testers</CardTitle>
            <CardDescription>View all early adopters and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {founders?.map((founder) => (
                <div key={founder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{founder.name || "Unknown"}</span>
                        <Badge variant={founder.userTier === "founder_core" ? "default" : "secondary"}>
                          {founder.founderBadge}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{founder.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {founder.lifetimeFree ? "Lifetime Free" : "Beta Tester"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last seen: {founder.lastSignedIn ? new Date(founder.lastSignedIn).toLocaleDateString() : "Never"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Adoption */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Experimental Feature Adoption</CardTitle>
            <CardDescription>See which features founders are testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureAdoption?.features.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium capitalize">{feature.name.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-sm text-muted-foreground">{feature.count} founders enabled</div>
                    </div>
                  </div>
                  <Badge variant="outline">{feature.percentage}%</Badge>
                </div>
              ))}
              {(!featureAdoption?.features || featureAdoption.features.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No experimental features enabled yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Founder Suggestions</CardTitle>
            <CardDescription>Feature requests and feedback from founders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions?.map((suggestion, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{suggestion.founderBadge}</Badge>
                      <span className="text-sm text-muted-foreground">{suggestion.userName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(suggestion.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                </div>
              ))}
              {(!suggestions || suggestions.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">No suggestions submitted yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
