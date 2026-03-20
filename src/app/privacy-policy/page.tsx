import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CloudStream by KM",
  description: "Privacy Policy for CloudStream by KM.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 md:px-8">
      <div className="premium-surface rounded-[2rem] p-8 md:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Legal
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Privacy Policy
            </h1>
          </div>
          <Link
            className="glass-pill glass-hover rounded-full px-4 py-2 text-sm text-foreground"
            href="/"
          >
            Back to home
          </Link>
        </div>

        <div className="space-y-8 text-sm leading-7 text-muted-foreground md:text-base">
          <section className="space-y-3">
            <p>
              This Privacy Policy explains how CloudStream by KM collects, uses,
              and protects information when you sign in with Google and use the
              app to browse and stream files from your Google Drive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Information We Access</h2>
            <p>
              CloudStream uses Google Sign-In and Google Drive read-only access
              to let you authenticate and browse files that already exist in
              your Google Drive.
            </p>
            <p>We may access the following information:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your basic Google account information, such as name, email, and profile image.</li>
              <li>Your Google Drive file metadata, such as file names, MIME types, folder structure, modified times, and file sizes.</li>
              <li>Video stream requests needed to play supported Drive video files.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">How Information Is Used</h2>
            <p>CloudStream uses this information only to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Authenticate you with your Google account.</li>
              <li>Display your Google Drive files and folders inside the app.</li>
              <li>Stream video content you choose to open.</li>
              <li>Maintain session state and playback progress.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data Storage</h2>
            <p>
              CloudStream does not claim ownership of your Google Drive content.
              The app may temporarily process file metadata and streaming
              responses in order to render the interface and support playback.
            </p>
            <p>
              Playback progress and similar convenience settings may be stored
              locally in your browser.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p>CloudStream depends on third-party services, including:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Google OAuth for sign-in</li>
              <li>Google Drive API for read-only file access</li>
              <li>Hosting and infrastructure providers used to serve the app</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
            <p>
              Reasonable steps are taken to protect authentication tokens and
              session data. However, no internet-based service can guarantee
              absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Your Choices</h2>
            <p>
              You can stop using the app at any time. You may also revoke Google
              Drive access from your Google account permissions page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact the app
              owner through the contact details you publish for this service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
