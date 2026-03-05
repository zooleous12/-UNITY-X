import { Link } from "wouter";

export default function Privacy() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: January 25, 2026</p>

          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Lecture Me is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our educational platform.
              </p>
              <p className="mt-4">
                <strong>Service Provider:</strong> Charles Kendrick<br />
                <strong>Service Name:</strong> Lecture Me<br />
                <strong>Website:</strong> <a href="https://lectureme.org" className="text-purple-600 hover:underline">https://lectureme.org</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Personal Information</h3>
              <p>When you create an account, we collect your name, email address, and optional profile information.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Educational Content</h3>
              <p>We collect uploaded files, generated study materials, study progress data, and course information.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Usage Information</h3>
              <p>We automatically collect log data, usage patterns, performance data, and cookies for analytics and service improvement.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Process uploads and generate study materials</li>
                <li>Track learning progress and provide recommendations</li>
                <li>Improve AI accuracy and feature quality</li>
                <li>Send service notifications and support communications</li>
                <li>Comply with legal obligations and protect against fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Share Your Information</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">We Do Not Sell Your Data</h3>
              <p className="font-semibold text-purple-700">We do not sell, rent, or trade your personal information or educational content to third parties for marketing purposes.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Service Providers</h3>
              <p>We share data with trusted third parties who help us operate (hosting, payment processing, AI services, analytics). All service providers are contractually obligated to protect your data.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Educational Institutions</h3>
              <p>If you access through an institutional account, your institution may have access to your usage and progress data. We comply with FERPA requirements for student data protection.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>We implement industry-standard security practices including encryption in transit and at rest, access controls, secure storage, and regular security audits. While we strive to protect your data, no method is 100% secure.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Access and export your personal information and educational content</li>
                <li>Update your account information and correct inaccurate data</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing emails (essential service communications continue)</li>
                <li>Manage cookie preferences through browser settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Educational Data Protection</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">FERPA Compliance</h3>
              <p>For U.S. educational institutions, we comply with the Family Educational Rights and Privacy Act (FERPA). We act as a school official with legitimate educational interest and do not share student data without proper authorization.</p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">International Compliance</h3>
              <p>We comply with GDPR for EU users and CCPA for California users, including rights to access, deletion, portability, and opt-out.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p>Lecture Me is not intended for children under 13. We do not knowingly collect information from children under 13. For users aged 13-18, we recommend parental guidance.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                For questions about this Privacy Policy or to exercise your rights:<br />
                <strong>Email:</strong> privacy@lectureme.org<br />
                <strong>Website:</strong> <a href="https://lectureme.org/privacy" className="text-purple-600 hover:underline">https://lectureme.org/privacy</a>
              </p>
            </section>

            <div className="mt-12 p-6 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700">
                <strong>By using Lecture Me, you acknowledge that you have read and understood this Privacy Policy.</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                For the complete Privacy Policy, please see our <a href="/PRIVACY_POLICY.md" className="text-purple-600 hover:underline">full legal document</a>.
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
