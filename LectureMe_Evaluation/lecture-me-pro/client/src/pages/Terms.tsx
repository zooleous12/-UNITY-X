import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              🤖 Lecture Me
            </a>
          </Link>
          <Link href="/">
            <a className="text-sm text-gray-600 hover:text-gray-900">← Back to Home</a>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 25, 2026</p>

          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using Lecture Me ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
              <p className="mt-4">
                <strong>Service Provider:</strong> Charles Kendrick<br />
                <strong>Service Name:</strong> Lecture Me<br />
                <strong>Website:</strong> <a href="https://lectureme.org" className="text-purple-600 hover:underline">https://lectureme.org</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>Lecture Me is an AI-powered educational platform that provides:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Audio and document transcription services</li>
                <li>AI-generated flashcards and study materials</li>
                <li>Spaced repetition learning tools</li>
                <li>Study progress tracking and analytics</li>
                <li>Course organization and management</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Account Creation</h3>
              <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials. You must be at least 13 years old to use the Service.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Account Responsibilities</h3>
              <p>You are responsible for all activity under your account and must notify us immediately of any unauthorized access.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Ownership</h3>
              <p>You retain all ownership rights to content you upload. By uploading content, you grant us a limited license to process, store, and display your content solely to provide the Service.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Content Restrictions</h3>
              <p>You agree not to upload content that violates any law, infringes on intellectual property rights, contains malware, or is defamatory or obscene.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment and Subscriptions</h2>
              <p>Subscriptions are billed on a recurring basis. We offer a 7-day money-back guarantee for first-time subscribers. You may cancel your subscription at any time, with cancellation taking effect at the end of the current billing period.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="font-semibold">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
              <p className="mt-2">To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount you paid in the past 12 months.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data Protection</h2>
              <p>We collect and process data as described in our <Link href="/privacy"><a className="text-purple-600 hover:underline">Privacy Policy</a></Link>. We comply with applicable data protection laws including FERPA, GDPR, and CCPA.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p>You may terminate your account at any time. We may suspend or terminate your account if you violate these terms or engage in fraudulent activity.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
              <p>
                For questions about these Terms of Service:<br />
                <strong>Email:</strong> support@lectureme.org<br />
                <strong>Website:</strong> <a href="https://lectureme.org" className="text-purple-600 hover:underline">https://lectureme.org</a>
              </p>
            </section>

            <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700">
                <strong>By using Lecture Me, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For the complete Terms of Service, please see our <a href="/TERMS_OF_SERVICE.md" className="text-purple-600 hover:underline">full legal document</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2026 Lecture Me. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/terms"><a className="text-gray-600 hover:text-gray-900">Terms</a></Link>
              <Link href="/privacy"><a className="text-gray-600 hover:text-gray-900">Privacy</a></Link>
              <a href="mailto:support@lectureme.org" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
