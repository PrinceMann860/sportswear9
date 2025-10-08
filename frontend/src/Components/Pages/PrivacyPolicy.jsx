const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information that you provide directly to us, including when you create an account,
              make a purchase, subscribe to our newsletter, or contact us for support. This may include
              your name, email address, phone number, shipping address, and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Improve our website and customer service</li>
              <li>Personalize your shopping experience</li>
              <li>Protect against fraudulent transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Information Sharing</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with trusted service providers who assist us in operating our website,
              conducting our business, or servicing you, as long as they agree to keep this information
              confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate security measures to protect your personal information from
              unauthorized access, alteration, disclosure, or destruction. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Cookies</h2>
            <p className="leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize
              content. You can choose to disable cookies through your browser settings, but this may
              affect your ability to use certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to access, correct, or delete your personal information. You may also
              opt-out of receiving promotional communications from us at any time by following the
              unsubscribe instructions in our emails or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our
              customer support channels.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8 pt-6 border-t">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
