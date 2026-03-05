/**
 * Unity Core Integration Service
 * Connects Lecture Me to your Unity AI Ecosystem
 */

interface UnityIntelligence {
  type: 'study_pattern' | 'content_analysis' | 'user_preference' | 'learning_insight';
  source: 'lecture-me' | 'context-forge' | 'chop-shop-supreme' | 'ai-orchestrator';
  data: any;
  confidence: number;
  timestamp: number;
}

interface UnityRecommendation {
  type: 'study_method' | 'content_suggestion' | 'timing_optimization' | 'difficulty_adjustment';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  metadata?: any;
}

interface StudySession {
  userId: string;
  materialId: string;
  duration: number;
  performance: number;
  difficulty: number;
  topics: string[];
  timestamp: number;
}

class UnityCore {
  private baseUrl: string;
  private isConnected: boolean = false;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    // Try different Unity Core locations
    this.baseUrl = this.detectUnityCore();
    this.testConnection();
  }

  private detectUnityCore(): string {
    // Check stored port from previous successful connection
    const storedPort = localStorage.getItem('unity_core_port');
    if (storedPort) {
      return `http://localhost:${storedPort}`;
    }
    
    // Default to 3000 for initial attempt
    // Will scan all ports in testConnection()
    return 'http://localhost:3000';
  }

  private async testConnection(): Promise<void> {
    // Generate list of ports to scan
    const portsToScan = [
      ...Array.from({ length: 11 }, (_, i) => 3000 + i), // 3000-3010
      ...Array.from({ length: 11 }, (_, i) => 5000 + i), // 5000-5010
      ...Array.from({ length: 11 }, (_, i) => 8000 + i), // 8000-8010
    ];

    // Try each port with short timeout
    for (const port of portsToScan) {
      try {
        const response = await fetch(`http://localhost:${port}/unity/api/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(500) // Fast 500ms timeout per port
        });
        
        if (response.ok) {
          this.baseUrl = `http://localhost:${port}`;
          this.isConnected = true;
          // Store successful port for faster reconnection
          localStorage.setItem('unity_core_port', port.toString());
          console.log(`✅ Unity Core connected on port ${port}`);
          this.registerApp();
          return;
        }
      } catch (error) {
        // Port not available, continue scanning
        continue;
      }
    }

    // No Unity Core found on any port
    this.isConnected = false;
    console.log('ℹ️ Unity Core not available - running in standalone mode');
    console.log(`   Scanned ports: ${portsToScan.join(', ')}`);
  }

  private async registerApp(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await fetch(`${this.baseUrl}/unity/api/apps/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'lecture-me',
          name: 'Lecture Me',
          version: '1.0.0',
          capabilities: [
            'study-material-processing',
            'learning-analytics',
            'spaced-repetition',
            'content-analysis',
            'user-progress-tracking'
          ],
          endpoints: [window.location.origin],
          status: 'active'
        })
      });
    } catch (error) {
      console.warn('Failed to register with Unity Core:', error);
    }
  }

  /**
   * Share learning intelligence with Unity ecosystem
   */
  async shareIntelligence(intelligence: Omit<UnityIntelligence, 'timestamp'>): Promise<boolean> {
    if (!this.isConnected) return false;

    try {
      const response = await fetch(`${this.baseUrl}/unity/api/intelligence/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...intelligence,
          timestamp: Date.now()
        })
      });

      return response.ok;
    } catch (error) {
      console.warn('Failed to share intelligence:', error);
      return false;
    }
  }

  /**
   * Get study recommendations from Unity AI
   */
  async getStudyRecommendations(context: {
    userId: string;
    currentMaterial?: string;
    recentPerformance?: number[];
    studyGoals?: string[];
    timeAvailable?: number;
  }): Promise<UnityRecommendation[]> {
    if (!this.isConnected) {
      return this.getFallbackRecommendations(context);
    }

    try {
      const response = await fetch(`${this.baseUrl}/unity/api/recommendations/study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      });

      if (response.ok) {
        const recommendations = await response.json();
        return recommendations;
      }
    } catch (error) {
      console.warn('Failed to get Unity recommendations:', error);
    }

    return this.getFallbackRecommendations(context);
  }

  /**
   * Analyze study content using Unity intelligence
   */
  async analyzeContent(content: {
    text?: string;
    audio?: Blob;
    pdf?: File;
    type: 'text' | 'audio' | 'pdf';
  }): Promise<{
    topics: string[];
    difficulty: number;
    estimatedStudyTime: number;
    keyPoints: string[];
    suggestedQuestions: string[];
    unityEnhanced: boolean;
  }> {
    if (!this.isConnected) {
      return this.getFallbackAnalysis(content);
    }

    try {
      const formData = new FormData();
      formData.append('type', content.type);
      
      if (content.text) formData.append('text', content.text);
      if (content.audio) formData.append('audio', content.audio);
      if (content.pdf) formData.append('pdf', content.pdf);

      const response = await fetch(`${this.baseUrl}/unity/api/analysis/content`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const analysis = await response.json();
        return { ...analysis, unityEnhanced: true };
      }
    } catch (error) {
      console.warn('Failed to analyze content with Unity:', error);
    }

    return this.getFallbackAnalysis(content);
  }

  /**
   * Track study session for Unity learning
   */
  async trackStudySession(session: StudySession): Promise<void> {
    // Always track locally first
    this.trackLocalSession(session);

    // Share with Unity if connected
    if (this.isConnected) {
      try {
        await this.shareIntelligence({
          type: 'study_pattern',
          source: 'lecture-me',
          data: session,
          confidence: 0.9
        });
      } catch (error) {
        console.warn('Failed to track session with Unity:', error);
      }
    }
  }

  /**
   * Get cross-app insights from Unity ecosystem
   */
  async getCrossAppInsights(userId: string): Promise<{
    contextForgeAnalysis?: any;
    chopShopProjects?: any[];
    aiOrchestratorWorkflows?: any[];
    unityAvailable: boolean;
  }> {
    if (!this.isConnected) {
      return { unityAvailable: false };
    }

    try {
      const response = await fetch(`${this.baseUrl}/unity/api/insights/cross-app`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, requester: 'lecture-me' })
      });

      if (response.ok) {
        const insights = await response.json();
        return { ...insights, unityAvailable: true };
      }
    } catch (error) {
      console.warn('Failed to get cross-app insights:', error);
    }

    return { unityAvailable: false };
  }

  /**
   * Request Unity workflow automation
   */
  async requestWorkflow(workflow: {
    name: string;
    steps: Array<{
      app: string;
      action: string;
      input: any;
    }>;
    trigger: 'manual' | 'automatic';
  }): Promise<string | null> {
    if (!this.isConnected) return null;

    try {
      const response = await fetch(`${this.baseUrl}/unity/api/workflows/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });

      if (response.ok) {
        const result = await response.json();
        return result.workflowId;
      }
    } catch (error) {
      console.warn('Failed to create Unity workflow:', error);
    }

    return null;
  }

  // Fallback methods for standalone operation
  private getFallbackRecommendations(context: any): UnityRecommendation[] {
    return [
      {
        type: 'study_method',
        title: 'Spaced Repetition',
        description: 'Review this material again in 2 days for better retention',
        confidence: 0.8,
        actionable: true
      },
      {
        type: 'timing_optimization',
        title: 'Optimal Study Time',
        description: 'Based on your patterns, study this material in the morning',
        confidence: 0.7,
        actionable: true
      }
    ];
  }

  private getFallbackAnalysis(content: any) {
    return {
      topics: ['General Study Material'],
      difficulty: 5,
      estimatedStudyTime: 30,
      keyPoints: ['Key concepts identified'],
      suggestedQuestions: ['What are the main points?'],
      unityEnhanced: false
    };
  }

  private trackLocalSession(session: StudySession): void {
    // Store in localStorage for local analytics
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
    sessions.push(session);
    
    // Keep only last 100 sessions
    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }
    
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }

  // Public getters
  get connected(): boolean {
    return this.isConnected;
  }

  get coreUrl(): string {
    return this.baseUrl;
  }

  /**
   * Manually retry connection
   */
  async reconnect(): Promise<boolean> {
    if (this.retryCount >= this.maxRetries) {
      console.log('Max retry attempts reached');
      return false;
    }

    this.retryCount++;
    await this.testConnection();
    return this.isConnected;
  }
}

// Export singleton instance
export const unityCore = new UnityCore();
export type { UnityIntelligence, UnityRecommendation, StudySession };