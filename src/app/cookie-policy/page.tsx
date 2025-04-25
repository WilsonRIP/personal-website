// src/app/cookie-policy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { WEBSITE_NAME, EMAIL, NAME } from "@/lib/types"; // Import constants

// --- TODO: Ensure this path is correct ---
const PRIVACY_POLICY_PATH = "/privacy-policy";
// --- End of TODO ---

// Basic Metadata for the page
export const metadata: Metadata = {
    // Use imported WEBSITE_NAME
    title: "Cookie Policy",
    description: `Cookie Policy for ${WEBSITE_NAME}.`,
};

// Use a Server Component for static content
export default function CookiePolicyPage() {
    // Use current date based on server location/build time
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const currentYear = new Date().getFullYear();

    return (
        // Applying the same gradient background as RootLayout
        <main className="flex min-h-screen flex-col items-center p-6 sm:p-12 md:p-16 lg:p-24 bg-gradient-to-br from-background via-blue-900/10 to-teal-900/20 dark:from-slate-900 dark:via-teal-900/20 dark:to-blue-900/10 text-slate-900 dark:text-slate-200">
            <div className="w-full max-w-4xl space-y-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8">
                    Cookie Policy
                </h1>

                {/* Use prose for readable text styling */}
                <div className="prose prose-neutral dark:prose-invert max-w-none bg-background/70 dark:bg-slate-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-md border border-slate-200/50 dark:border-slate-700/50">

                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Last Updated: {currentDate}
                    </p>

                    {/* --- Legal Disclaimer --- */}
                    <div className="p-4 mb-6 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/30">
                        <p className="font-semibold text-red-800 dark:text-red-300">
                            Legal Disclaimer:
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-400">
                            This template does not constitute legal advice. Please consult a qualified legal professional to ensure this policy meets your specific requirements and complies with all relevant laws (including US state laws like CCPA/CPRA and potentially international regulations like GDPR).
                        </p>
                    </div>
                    {/* --- End Legal Disclaimer --- */}

                    <h2>1. Introduction</h2>
                    <p>
                        This Cookie Policy explains how {NAME} ("I", "me", "my") uses cookies and similar technologies on {WEBSITE_NAME} (the "Site"). It explains what these technologies are and why we use them, as well as your rights to control our use of them. This policy should be read together with our <Link href={PRIVACY_POLICY_PATH}>Privacy Policy</Link>.
                    </p>

                    <h2>2. What Are Cookies?</h2>
                    <p>
                        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>
                    <p>
                        Cookies set by the website owner ({NAME}) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                    </p>
                    <p>
                        We may also use similar technologies like web beacons (sometimes called "tracking pixels" or "clear gifs") and local storage. These are often used in conjunction with cookies, but are stored differently. For simplicity, this policy refers to all such technologies as "cookies".
                    </p>

                    <h2>3. How We Use Cookies</h2>
                    <p>
                        We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our Site to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Site (primarily through analytics).
                    </p>
                    <p>The specific types of first-party and third-party cookies served through our Site and the purposes they perform are described below:</p>
                    <ul>
                        <li>
                            <strong>Strictly Necessary Cookies:</strong> These cookies are essential to provide you with services available through our Site and to enable you to use some of its features, such as access to secure areas (if any) or basic site navigation. Because these cookies are strictly necessary to deliver the Site to you, you cannot refuse them without impacting how our Site functions. These may include cookies set by our hosting platform (Vercel) for security or load balancing.
                        </li>
                        <li>
                            <strong>Performance and Analytics Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our Site is being used or how effective our marketing campaigns are, or to help us customize our Site for you.
                            <ul>
                                <li>
                                    <strong>Vercel Analytics:</strong> We use Vercel Analytics to understand visitor traffic and behavior on our Site. Vercel Analytics sets cookies to collect data such as pages visited, time spent on pages, browser type, device type, and general location (country/city level). This information is aggregated and anonymized, helping us improve the Site's performance and content. You can learn more about Vercel's data practices in the <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a>.
                                </li>
                            </ul>
                        </li>
                         <li>
                            <strong>Functionality Cookies:</strong> These cookies are used to recognize you when you return to our Site (if applicable) or remember choices you make (such as your language or the region you are in, or perhaps theme preference if such features are implemented). These enable us to personalize our content for you and remember your preferences. Currently, our site primarily uses standard browser storage (like localStorage) for theme preferences, which is not a cookie but functions similarly for remembering settings.
                        </li>
                       <li>
                            <strong>Targeting/Advertising Cookies:</strong> We **do not** use targeting or advertising cookies on this Site. We do not track your activity across other websites to provide you with targeted advertising.
                        </li>
                    </ul>

                    <h2>4. Third-Party Cookies</h2>
                    <p>
                        As mentioned above, the primary third-party cookies used on this site are from Vercel Analytics.
                    </p>
                    <p>
                       Additionally, if we embed content from other websites (e.g., YouTube videos, social media feeds), these third-party sites may set their own cookies when you interact with that content. We do not control the setting of these cookies, so we suggest you check the third-party websites for more information about their cookies and how to manage them.
                    </p>

                    <h2>5. Your Choices & Managing Cookies</h2>
                    <p>
                        You have the right to decide whether to accept or reject cookies (other than strictly necessary ones). You can exercise your cookie preferences by setting or amending your web browser controls.
                    </p>
                    <p>
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a> or <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.
                    </p>
                    <p>Find out how to manage cookies on popular browsers:</p>
                    <ul>
                        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                        <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Internet Explorer</a></li>
                        <li><a href="https://support.apple.com/guide/opera/opr14710/mac" target="_blank" rel="noopener noreferrer">Opera</a></li>
                        <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                    </ul>
                    <p>
                        To opt out of being tracked by Google Analytics across all websites, visit <a href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">http://tools.google.com/dlpage/gaoptout</a>. (Note: This site uses Vercel Analytics, not Google Analytics, but this link is provided for general information).
                    </p>
                    <p>
                        Please note that if you choose to block or delete cookies, certain features of the Site may not operate correctly or at all.
                    </p>
                     {/* Optional: Add if you implement a cookie consent banner/tool
                    <p>
                        You may also manage your preferences related to cookies used on our site via our cookie consent tool [Link to Tool/Settings if you have one].
                    </p>
                     */}

                    <h2>6. Changes to This Cookie Policy</h2>
                    <p>
                        We may update this Cookie Policy from time to time to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
                    </p>

                    <h2>7. Contact Information</h2>
                    <p>
                        If you have any questions about our use of cookies or other technologies, please email us at: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> {/* Or replace with: <Link href="/contact">Contact Page</Link> */}
                    </p>
                    <p>
                        For more information about how we handle your personal data, please see our <Link href={PRIVACY_POLICY_PATH}>Privacy Policy</Link>.
                    </p>

                </div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
                     © {currentYear} {NAME}. All rights reserved.
                </p>
            </div>
        </main>
    );
}