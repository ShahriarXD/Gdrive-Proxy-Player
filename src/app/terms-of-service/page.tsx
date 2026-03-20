import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | CloudStream by KM",
  description: "Terms of Service for CloudStream by KM.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12 md:px-8">
      <div className="premium-surface rounded-[2rem] p-8 md:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Legal
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              Terms of Service
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
              These Terms of Service govern your use of CloudStream by KM. By
              using the service, you agree to these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Service Description</h2>
            <p>
              CloudStream provides a user interface for browsing Google Drive
              files and streaming supported video content from your own Google
              Drive account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Eligibility and Access</h2>
            <p>
              You are responsible for using a valid Google account and for
              maintaining the security of your own login credentials and device.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Use the service for unlawful activity.</li>
              <li>Attempt to bypass authentication, authorization, or service limitations.</li>
              <li>Interfere with the normal operation, availability, or security of the service.</li>
              <li>Use the app to access content you do not have permission to access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Google Drive Content</h2>
            <p>
              You remain fully responsible for the files and content available
              through your Google Drive account. CloudStream does not acquire
              ownership of that content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Availability</h2>
            <p>
              The service may change, be updated, interrupted, or discontinued
              at any time without notice. Availability is not guaranteed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">No Warranty</h2>
            <p>
              The service is provided on an “as is” and “as available” basis
              without warranties of any kind, to the fullest extent permitted by
              applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, the service owner is not
              liable for indirect, incidental, special, consequential, or
              punitive damages arising from use of the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Termination</h2>
            <p>
              Access may be suspended or terminated at any time, especially if
              the service is misused or these terms are violated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Changes to These Terms</h2>
            <p>
              These Terms of Service may be updated from time to time. Continued
              use of the service after changes means you accept the updated
              terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
