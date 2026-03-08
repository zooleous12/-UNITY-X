import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Settings, Palette, Layout, Sparkles, Send, Crown } from "lucide-react";

export default function FounderSettings() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  // Check if user is a founder
  const isFounder = user?.userTier === "founder_core" || user?.userTier === "beta_tester";
  
  const { data: preferences, isLoading } = trpc.preferences.getPreferences.useQuery();
  
  const updateTheme = trpc.preferences.updateTheme.useMutation({
    onSuccess: () => {
      toast.success("Theme updated!");
      utils.preferences.getPreferences.invalidate();
    },
  });
  
  const updateLayout = trpc.preferences.updateLayout.useMutation({
    onSuccess: () => {
      toast.success("Layout updated!");
      utils.preferences.getPreferences.invalidate();
    },
  });
  
  const toggleFeature = trpc.preferences.toggleFeature.useMutation({
    onSuccess: () => {
      toast.success("Feature toggled!");
      utils.preferences.getPreferences.invalidate();
    },
  });
  
  const submitSuggestion = trpc.preferences.submitSuggestion.useMutation({
    onSuccess: () => {
      toast.success("Suggestion submitted to Charles! 🎉");
      setSuggestionTitle("");
      setSuggestionDescription("");
      setDialogOpen(false);
    },
  });
  
  const [suggestionTitle, setSuggestionTitle] = useState("");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  if (!isFounder) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Founder Access Only
            </CardTitle>
            <CardDescription>
              These developer options are only available to Lecture Me founders and beta testers.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (isLoading || !preferences) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Founder Developer Options
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your Lecture Me experience • {user?.founderBadge}
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Submit Suggestion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suggest a Feature</DialogTitle>
              <DialogDescription>
                Your suggestion will be sent directly to Charles for review. If approved, it will be rolled out to all users!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Add dark mode toggle to dashboard"
                  value={suggestionTitle}
                  onChange={(e) => setSuggestionTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain your suggestion in detail..."
                  value={suggestionDescription}
                  onChange={(e) => setSuggestionDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={() => {
                  if (!suggestionTitle || !suggestionDescription) {
                    toast.error("Please fill in both fields");
                    return;
                  }
                  submitSuggestion.mutate({
                    title: suggestionTitle,
                    description: suggestionDescription,
                  });
                }}
                disabled={submitSuggestion.isPending}
                className="w-full"
              >
                {submitSuggestion.isPending ? "Submitting..." : "Submit to Charles"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Theme Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customization
          </CardTitle>
          <CardDescription>
            Personalize colors, fonts, and visual style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Purple Shade</Label>
            <Select
              value={preferences.purpleShade || "default"}
              onValueChange={(value) => updateTheme.mutate({ purpleShade: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lighter">Lighter Purple</SelectItem>
                <SelectItem value="default">Default Purple</SelectItem>
                <SelectItem value="darker">Darker Purple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Select
              value={preferences.fontSize || "medium"}
              onValueChange={(value: "small" | "medium" | "large") => updateTheme.mutate({ fontSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={preferences.accentColor || "#a855f7"}
                onChange={(e) => updateTheme.mutate({ accentColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                type="text"
                value={preferences.accentColor || "#a855f7"}
                onChange={(e) => updateTheme.mutate({ accentColor: e.target.value })}
                placeholder="#a855f7"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Layout Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Layout Preferences
          </CardTitle>
          <CardDescription>
            Adjust spacing, card styles, and navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Card Layout</Label>
            <Select
              value={preferences.cardLayout || "comfortable"}
              onValueChange={(value: "compact" | "comfortable" | "spacious") => 
                updateLayout.mutate({ cardLayout: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Sidebar Position</Label>
            <Select
              value={preferences.sidebarPosition || "left"}
              onValueChange={(value: "left" | "right" | "hidden") => 
                updateLayout.mutate({ sidebarPosition: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Experimental Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Experimental Features
          </CardTitle>
          <CardDescription>
            Try new features before they're released to everyone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI Study Recommendations</Label>
              <p className="text-sm text-muted-foreground">
                Get personalized study suggestions based on your performance
              </p>
            </div>
            <Switch
              checked={preferences.experimentalFeatures?.aiRecommendations || false}
              onCheckedChange={(checked) => 
                toggleFeature.mutate({ featureKey: "aiRecommendations", enabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Advanced Analytics</Label>
              <p className="text-sm text-muted-foreground">
                View detailed charts and insights about your study habits
              </p>
            </div>
            <Switch
              checked={preferences.experimentalFeatures?.advancedAnalytics || false}
              onCheckedChange={(checked) => 
                toggleFeature.mutate({ featureKey: "advancedAnalytics", enabled: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Collaborative Study Groups</Label>
              <p className="text-sm text-muted-foreground">
                Share flashcards and materials with classmates
              </p>
            </div>
            <Switch
              checked={preferences.experimentalFeatures?.studyGroups || false}
              onCheckedChange={(checked) => 
                toggleFeature.mutate({ featureKey: "studyGroups", enabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Previous Suggestions */}
      {preferences.submittedSuggestions && preferences.submittedSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Suggestions</CardTitle>
            <CardDescription>
              Ideas you've submitted to Charles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {preferences.submittedSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="border-l-2 border-primary pl-4 py-2">
                  <p className="font-medium">{suggestion.title}</p>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(suggestion.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
