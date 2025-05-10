// src/app/terms-of-service/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { WEBSITE_NAME, EMAIL, NAME } from "@/lib/types"; // Import constants

// --- TODO: Ensure this path is correct ---
const PRIVACY_POLICY_PATH = "/privacy-policy";
// --- End of TODO ---

// Basic Metadata for the page
export const metadata: Metadata = {
  // Use imported WEBSITE_NAME
  title: "Terms of Service",
  description: `Terms of Service for using ${WEBSITE_NAME}.`,
};

// Use a Server Component for static content like this
export default function TermsOfServicePage() {
  // Use current date based on server location/build time
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    // Applying the same gradient background as RootLayout
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-16 lg:p-24 bg-gradient-to-br from-background via-blue-900/10 to-teal-900/20 dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10 text-slate-900 dark:text-slate-200">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 title-komikax" style={{ fontFamily: "KOMIKAX, sans-serif" }}>
          Terms of Service
        </h1>

        {/* Use prose for readable text styling */}
        <div className="prose prose-neutral dark:prose-invert max-w-none bg-background/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-700/50">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Effective Date: {currentDate}
          </p>

          {/* --- Legal Disclaimer --- */}
          <div className="p-4 mb-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30">
            <p className="font-semibold text-red-800 dark:text-red-300">
              Important Disclaimer:
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">
              This document is a template and does not constitute legal advice.
              You should consult with a qualified legal professional (licensed
              in North Carolina) to tailor these terms to your specific needs
              and ensure compliance with all applicable laws.
            </p>
          </div>
          {/* --- End Legal Disclaimer --- */}

          <h2>1. Acceptance of Terms</h2>
          <p>
            {/* Use imported constants */}
            Welcome to {WEBSITE_NAME} (the &quot;Site&quot;), owned and operated
            by {NAME} (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;). By
            accessing or using this Site in any way, you agree to be bound by
            these Terms of Service (&quot;Terms&quot;) and our{" "}
            <Link href={PRIVACY_POLICY_PATH}>Privacy Policy</Link>, which is
            incorporated herein by reference. If you do not agree to all of
            these Terms, do not use this Site.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            This Site provides information about my professional services,
            portfolio, skills, blog posts, and potentially other related content
            (the &quot;Service&quot;). The information is provided for general
            informational purposes only.
          </p>

          <h2>3. Use of the Site</h2>
          <p>
            You agree to use the Site only for lawful purposes and in a way that
            does not infringe the rights of, restrict, or inhibit anyone
            else&apos;s use and enjoyment of the Site. Prohibited behavior
            includes:
          </p>
          <ul>
            <li>
              Harassing or causing distress or inconvenience to any person.
            </li>
            <li>Transmitting obscene or offensive content.</li>
            <li>Disrupting the normal flow of dialogue within the Site.</li>
            <li>
              Attempting to gain unauthorized access to the Site, the server on
              which the Site is stored, or any server, computer, or database
              connected to the Site.
            </li>
            <li>
              Engaging in any data mining, data harvesting, data extracting, or
              any other similar activity in relation to this Site.
            </li>
            <li>
              Using the Site in any way that is, or may be, damaging to this
              Site or impacts user access to this Site.
            </li>
            <li>
              Using this Site contrary to applicable laws and regulations
              (including those of North Carolina and the United States), or in a
              way that causes, or may cause, harm to the Site, or to any person
              or business entity.
            </li>
          </ul>

          <h2>4. Intellectual Property Rights</h2>
          <p>
            {/* Use imported constants */}
            Unless otherwise stated, I own the intellectual property rights for
            all material on {WEBSITE_NAME}. All intellectual property rights are
            reserved. This includes, but is not limited to, text, graphics,
            logos, icons, images, audio clips, video clips, digital downloads,
            data compilations, and software.
          </p>
          <p>
            {/* Use imported constants */}
            You may access this from {WEBSITE_NAME} for your own personal,
            non-commercial use subjected to restrictions set in these terms. You
            must not:
          </p>
          <ul>
            <li>Republish material from {WEBSITE_NAME}</li>
            <li>Sell, rent, or sub-license material from {WEBSITE_NAME}</li>
            <li>Reproduce, duplicate or copy material from {WEBSITE_NAME}</li>
            <li>Redistribute content from {WEBSITE_NAME}</li>
          </ul>
          <p>
            If you submit any content through forms or other interactive
            features (e.g., contact form inquiries), you grant me a
            non-exclusive, worldwide, royalty-free license to use, reproduce,
            and process such information solely for the purpose of responding to
            your inquiry or providing the requested Service, in accordance with
            the <Link href={PRIVACY_POLICY_PATH}>Privacy Policy</Link>.
          </p>

          <h2>5. Third-Party Links & Services</h2>
          <p>
            This Site may contain links to third-party websites or services that
            are not owned or controlled by me. I have no control over, and
            assume no responsibility for, the content, privacy policies, or
            practices of any third-party websites or services. You further
            acknowledge and agree that I shall not be responsible or liable,
            directly or indirectly, for any damage or loss caused or alleged to
            be caused by or in connection with the use of or reliance on any
            such content, goods, or services available on or through any such
            websites or services. We may use third-party services like Vercel
            Analytics for website analysis; your use of the site constitutes
            consent to their respective terms and privacy policies.
          </p>

          <h2>6. Disclaimers</h2>
          <p>
            This Site is provided &quot;as is,&quot; with all faults, and I make
            no express or implied representations or warranties, of any kind
            related to this Site or the materials contained on this Site.
            Additionally, nothing contained on this Site shall be construed as
            providing consult or advice to you. I do not warrant that the Site
            will be uninterrupted, error-free, secure, or free of viruses or
            other harmful components.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall I, nor any of my officers, directors, and
            employees (if applicable), be liable to you for anything arising out
            of or in any way connected with your use of this Site, whether such
            liability is under contract, tort or otherwise, and I, including my
            officers, directors, and employees shall not be liable for any
            indirect, consequential, or special liability arising out of or in
            any way related to your use of this Site. Because some jurisdictions
            (like North Carolina) may not allow the exclusion or limitation of
            liability for consequential or incidental damages, these limitations
            may not apply to you in full, but liability will be limited to the
            greatest extent permitted by law.
          </p>

          <h2>8. Indemnification</h2>
          <p>
            {/* Use imported constants */}
            You hereby indemnify to the fullest extent {NAME} from and against
            any and all liabilities, costs, demands, causes of action, damages,
            and expenses (including reasonable attorney&apos;s fees) arising out
            of or in any way related to your breach of any of the provisions of
            these Terms.
          </p>

          <h2>9. Termination</h2>
          <p>
            I may terminate or suspend your access to the Site immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms. All provisions
            of the Terms which by their nature should survive termination shall
            survive termination, including, without limitation, ownership
            provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </p>

          <h2>10. Governing Law & Jurisdiction</h2>
          <p>
            These Terms will be governed by and construed in accordance with the
            laws of the State of North Carolina, United States, without regard
            to its conflict of law provisions. You agree to submit to the
            personal and exclusive jurisdiction of the state and federal courts
            located within Union County, North Carolina (or the appropriate
            federal district court) for the resolution of any disputes arising
            out of or relating to these Terms or the Site.
          </p>

          <h2>11. Changes to These Terms</h2>
          <p>
            I reserve the right, at my sole discretion, to modify or replace
            these Terms at any time. If a revision is material, I will try to
            provide reasonable notice prior to any new terms taking effect,
            typically by updating the &quot;Effective Date&quot; at the top of
            this page and potentially posting a notice on the Site. What
            constitutes a material change will be determined at my sole
            discretion. By continuing to access or use the Service after those
            revisions become effective, you agree to be bound by the revised
            terms. It is your responsibility to check these Terms periodically
            for changes.
          </p>

          <h2>12. Contact Information</h2>
          <p>
            {/* Use imported constants */}
            If you have any questions about these Terms, please contact me at:{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>{" "}
            {/* Or replace with: <Link href="/contact">Contact Page</Link> if preferred */}
          </p>
        </div>
      </div>
    </main>
  );
}
