/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This file is part of Lecture Me - College Edition™, an AI-powered study platform.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * 
 * Author: Charles Kendrick <lectureme.app@gmail.com>
 * Project: Lecture Me - College Edition
 * Location: Phoenix, Arizona, USA
 * 
 * For licensing inquiries: lectureme.app@gmail.com
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AudioUploadPage from "./pages/AudioUploadPage";
import PDFUploadPage from "./pages/PDFUploadPage";
import { VideoUploadPage } from "./pages/VideoUploadPage";
import Pricing from "./pages/Pricing";
import Analytics from "./pages/Analytics";
import RecordLecture from "./pages/RecordLecture";
import Settings from "./pages/Settings";
import Courses from "./pages/Courses";
import MaterialDetail from "./pages/MaterialDetail";
import FlashcardReview from "./pages/FlashcardReview";
import ReviewSession from "./pages/ReviewSession";
import FounderSettings from "./pages/FounderSettings";
import FounderAnalytics from "./pages/FounderAnalytics";
import Community from "./pages/Community";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { InstallPWA } from "./components/InstallPWA";
import { DevCockpit } from "./components/DevCockpit";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/upload/audio"} component={AudioUploadPage} />
      <Route path={"/upload/pdf"} component={PDFUploadPage} />
      <Route path={"/upload/video"} component={VideoUploadPage} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/record"} component={RecordLecture} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/community"} component={Community} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/courses"} component={Courses} />
      <Route path={"/material/:id"} component={MaterialDetail} />
      <Route path={"/flashcards/review"} component={FlashcardReview} />
      <Route path={"/review"} component={ReviewSession} />
      <Route path={"/founder-settings"} component={FounderSettings} />
      <Route path={"/admin/founder-analytics"} component={FounderAnalytics} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <InstallPWA />
          <DevCockpit />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
