import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Elev8 AI Solutions &amp; Services
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: March 15, 2026
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="mb-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Table of Contents
          </h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-blue-700">
            <li><a href="#acceptance" className="hover:underline">Acceptance of Terms</a></li>
            <li><a href="#services" className="hover:underline">Description of Services</a></li>
            <li><a href="#accounts" className="hover:underline">Account Registration</a></li>
            <li><a href="#payment" className="hover:underline">Payment Terms</a></li>
            <li><a href="#ip" className="hover:underline">Intellectual Property</a></li>
            <li><a href="#responsibilities" className="hover:underline">User Responsibilities</a></li>
            <li><a href="#ai-disclaimer" className="hover:underline">AI-Generated Content Disclaimer</a></li>
            <li><a href="#liability" className="hover:underline">Limitation of Liability</a></li>
            <li><a href="#indemnification" className="hover:underline">Indemnification</a></li>
            <li><a href="#privacy" className="hover:underline">Privacy</a></li>
            <li><a href="#termination" className="hover:underline">Termination</a></li>
            <li><a href="#governing-law" className="hover:underline">Governing Law</a></li>
            <li><a href="#disputes" className="hover:underline">Dispute Resolution</a></li>
            <li><a href="#modifications" className="hover:underline">Modifications to Terms</a></li>
            <li><a href="#contact" className="hover:underline">Contact Information</a></li>
          </ol>
        </nav>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Elev8 AI Solutions &amp; Services (&quot;Company,&quot;
            &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms of
            Service (&quot;Terms&quot;) govern your access to and use of the
            website located at{" "}
            <a
              href="https://elev8ai.org"
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              elev8ai.org
            </a>{" "}
            (the &quot;Site&quot;), as well as all products, services, content,
            features, and applications offered by the Company (collectively, the
            &quot;Services&quot;). Elev8 AI Solutions &amp; Services is owned
            and operated by Brad Powell, with its principal place of business in
            New Port Richey, Florida 34653.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Please read these Terms carefully before using our Services. By
            accessing or using any part of the Site or Services, you agree to be
            bound by these Terms. If you do not agree to all the terms and
            conditions set forth herein, you must not access or use the Services.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-12">
          {/* Section 1 */}
          <section id="acceptance">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              1. Acceptance of Terms
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                By accessing, browsing, or using the Site or any of our
                Services, you acknowledge that you have read, understood, and
                agree to be bound by these Terms, along with our Privacy Policy,
                which is incorporated herein by reference. These Terms
                constitute a legally binding agreement between you and Elev8 AI
                Solutions &amp; Services.
              </p>
              <p>
                You represent and warrant that you are at least eighteen (18)
                years of age and have the legal capacity to enter into these
                Terms. If you are accessing or using the Services on behalf of a
                business entity, you represent and warrant that you have the
                authority to bind that entity to these Terms, and references to
                &quot;you&quot; shall include that entity.
              </p>
              <p>
                Your continued use of the Services following the posting of any
                changes to these Terms constitutes acceptance of those changes.
                We encourage you to review these Terms periodically.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="services">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              2. Description of Services
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Elev8 AI Solutions &amp; Services provides artificial
                intelligence consulting, development, and custom solutions
                designed to help businesses leverage AI technology. We
                specialize in serving businesses in the Tampa Bay area and
                beyond. Our Services include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>AI Chatbot Development</strong> &mdash; Custom-built
                  AI chatbots tailored to your business needs, with setup
                  starting at $1,299.
                </li>
                <li>
                  <strong>AI Call Answering</strong> &mdash; Intelligent
                  AI-powered phone answering and call handling solutions.
                </li>
                <li>
                  <strong>Marketing Automation</strong> &mdash; AI-driven
                  marketing workflows and campaign automation systems.
                </li>
                <li>
                  <strong>Employee AI Training</strong> &mdash; Training
                  programs to help your team effectively use AI tools and
                  technologies.
                </li>
                <li>
                  <strong>3D Logo Design</strong> &mdash; Professional 3D logo
                  creation and brand identity design services.
                </li>
                <li>
                  <strong>AI Landing Pages</strong> &mdash; AI-optimized landing
                  page design and development for lead generation and
                  conversions.
                </li>
                <li>
                  <strong>Viral Video Creation</strong> &mdash; AI-assisted
                  video content creation designed for social media engagement.
                </li>
                <li>
                  <strong>Local Service Optimization</strong> &mdash; AI-powered
                  local SEO and service area optimization for improved
                  visibility.
                </li>
                <li>
                  <strong>ADA Compliance Scanning</strong> &mdash; Automated
                  accessibility auditing and compliance scanning for websites.
                </li>
              </ul>
              <p>
                We also offer <strong>free AI assessments</strong> to help
                businesses evaluate how AI can improve their operations. Service
                scope, deliverables, timelines, and pricing for each engagement
                will be defined in a separate service agreement, statement of
                work, or proposal provided to the client prior to commencement
                of work.
              </p>
              <p>
                We reserve the right to modify, suspend, or discontinue any
                aspect of the Services at any time, with or without notice. We
                shall not be liable to you or any third party for any
                modification, suspension, or discontinuation of the Services.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="accounts">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              3. Account Registration
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Certain features of the Services, including our administrative
                panel and client portal, may require you to create an account.
                When registering for an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Provide accurate, current, and complete information during the
                  registration process.
                </li>
                <li>
                  Maintain and promptly update your account information to keep
                  it accurate, current, and complete.
                </li>
                <li>
                  Maintain the security and confidentiality of your login
                  credentials, including your password.
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account.
                </li>
                <li>
                  Immediately notify us of any unauthorized use of your account
                  or any other breach of security.
                </li>
              </ul>
              <p>
                We reserve the right to suspend or terminate your account at our
                sole discretion if we reasonably believe that your account
                information is inaccurate, that you have violated these Terms,
                or for any other reason we deem appropriate. You may not
                transfer, assign, or share your account credentials with any
                third party without our prior written consent.
              </p>
              <p>
                Administrative accounts are granted elevated access to the
                platform and are subject to additional security requirements.
                Misuse of administrative privileges may result in immediate
                account termination.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="payment">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              4. Payment Terms
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>4.1 Pricing.</strong> Prices for our Services are as
                quoted in individual proposals, service agreements, or as listed
                on the Site. All prices are in United States Dollars (USD)
                unless otherwise stated. We reserve the right to change our
                prices at any time; however, price changes will not affect
                orders or service agreements that have already been confirmed in
                writing.
              </p>
              <p>
                <strong>4.2 Payment Methods.</strong> We accept payment via
                credit and debit cards processed through Stripe, our
                third-party payment processor. By providing your payment
                information, you authorize us to charge the applicable fees to
                your designated payment method. All payment processing is
                handled by Stripe and is subject to{" "}
                <a
                  href="https://stripe.com/legal"
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Stripe&apos;s Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://stripe.com/privacy"
                  className="text-blue-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                . We do not store your full credit card information on our
                servers.
              </p>
              <p>
                <strong>4.3 Invoicing and Due Dates.</strong> For project-based
                work, payment terms will be specified in the applicable service
                agreement or statement of work. Unless otherwise agreed upon in
                writing, invoices are due within thirty (30) days of the invoice
                date. Late payments may be subject to a late fee of 1.5% per
                month on the outstanding balance, or the maximum rate permitted
                by applicable law, whichever is lower.
              </p>
              <p>
                <strong>4.4 Refund Policy.</strong> Due to the custom nature of
                our Services, refund eligibility is determined on a
                case-by-case basis. The following general guidelines apply:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>Before work begins:</strong> If you cancel a project
                  before any work has commenced, you are eligible for a full
                  refund of any deposits or prepayments made.
                </li>
                <li>
                  <strong>Work in progress:</strong> If a project is canceled
                  after work has begun, refunds will be prorated based on the
                  percentage of work completed. You will be billed for all work
                  performed up to the date of cancellation.
                </li>
                <li>
                  <strong>Completed deliverables:</strong> No refunds will be
                  issued for completed and delivered work that meets the
                  specifications outlined in the applicable service agreement.
                </li>
                <li>
                  <strong>Subscription services:</strong> For recurring
                  services, you may cancel at any time. Cancellation will take
                  effect at the end of the current billing cycle, and no
                  partial-month refunds will be issued.
                </li>
              </ul>
              <p>
                Refund requests must be submitted in writing to{" "}
                <a
                  href="mailto:powellb@elev8ai.com"
                  className="text-blue-700 hover:underline"
                >
                  powellb@elev8ai.com
                </a>{" "}
                within thirty (30) days of the charge in question.
              </p>
              <p>
                <strong>4.5 Nonprofit Discount Program.</strong> We offer
                discounted pricing for qualifying nonprofit organizations.
                Eligibility for our nonprofit discount program requires proof of
                tax-exempt status under Section 501(c)(3) of the Internal
                Revenue Code or equivalent documentation. Nonprofit discounts
                cannot be combined with other promotional offers unless
                expressly stated. We reserve the right to verify nonprofit
                status and to modify or discontinue the discount program at any
                time.
              </p>
              <p>
                <strong>4.6 Taxes.</strong> You are responsible for all
                applicable taxes, levies, or duties imposed by taxing
                authorities in connection with your use of the Services, except
                for taxes based on our net income.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="ip">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              5. Intellectual Property
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>5.1 Company Intellectual Property.</strong> All content,
                features, and functionality of the Site and Services, including
                but not limited to text, graphics, logos, icons, images, audio
                clips, digital downloads, data compilations, software, and the
                design, selection, and arrangement thereof, are the exclusive
                property of Elev8 AI Solutions &amp; Services or its licensors
                and are protected by United States and international copyright,
                trademark, patent, trade secret, and other intellectual property
                or proprietary rights laws.
              </p>
              <p>
                <strong>5.2 Client Deliverables.</strong> Unless otherwise
                specified in a separate written agreement, upon full payment for
                Services, the client shall receive a non-exclusive,
                non-transferable license to use the deliverables created for
                their project. Ownership of custom code, designs, and other
                deliverables will be addressed in individual service agreements.
                Where a service agreement provides for assignment of
                intellectual property rights, such assignment shall be effective
                only upon receipt of full payment.
              </p>
              <p>
                <strong>5.3 Pre-Existing and Third-Party Materials.</strong> We
                retain all rights to pre-existing intellectual property,
                proprietary tools, frameworks, libraries, and methodologies used
                in the creation of deliverables. Any third-party software,
                libraries, or assets incorporated into deliverables remain
                subject to their respective license terms.
              </p>
              <p>
                <strong>5.4 Portfolio Rights.</strong> Unless otherwise agreed
                in writing, we reserve the right to display and reference
                completed work in our portfolio, marketing materials, and case
                studies, provided that confidential information is not disclosed.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="responsibilities">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              6. User Responsibilities
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                By using our Services, you agree to the following
                responsibilities and restrictions. You shall not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  Use the Services for any unlawful purpose or in violation of
                  any applicable local, state, national, or international law or
                  regulation.
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  Services, other accounts, computer systems, or networks
                  connected to the Services.
                </li>
                <li>
                  Interfere with, disrupt, or create an undue burden on the
                  Services or the networks or infrastructure connected to the
                  Services.
                </li>
                <li>
                  Use any automated system, including robots, crawlers, scrapers,
                  or similar tools, to access the Services for any purpose
                  without our express written permission.
                </li>
                <li>
                  Reproduce, duplicate, copy, sell, resell, or exploit any
                  portion of the Services without our express written
                  permission.
                </li>
                <li>
                  Upload, transmit, or distribute any viruses, malware, or other
                  harmful code through the Services.
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  misrepresent your affiliation with any person or entity.
                </li>
                <li>
                  Use the Services to generate, distribute, or facilitate the
                  distribution of spam, unsolicited communications, or deceptive
                  content.
                </li>
                <li>
                  Reverse engineer, decompile, disassemble, or otherwise attempt
                  to derive the source code of any software or technology used
                  in connection with the Services.
                </li>
              </ul>
              <p>
                You are solely responsible for ensuring that your use of any
                deliverables or outputs from our Services complies with all
                applicable laws, regulations, and industry standards. You agree
                to provide timely and accurate information, materials, feedback,
                and approvals as reasonably required for us to perform the
                Services.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="ai-disclaimer">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              7. AI-Generated Content Disclaimer
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Our Services involve the use of artificial intelligence
                technologies, including but not limited to machine learning
                models, natural language processing, generative AI, and
                automated systems. You acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>
                  <strong>No Guarantee of Accuracy.</strong> AI-generated
                  content, outputs, and recommendations are produced by
                  automated systems and may contain errors, inaccuracies,
                  omissions, or biases. We do not guarantee the accuracy,
                  completeness, reliability, or suitability of any AI-generated
                  content for any particular purpose.
                </li>
                <li>
                  <strong>Human Review Recommended.</strong> All AI-generated
                  content should be reviewed by qualified human personnel before
                  being used in any business, legal, medical, financial, or
                  other professional context. You are solely responsible for
                  reviewing and validating any AI-generated content before use
                  or publication.
                </li>
                <li>
                  <strong>No Professional Advice.</strong> AI-generated content
                  does not constitute legal, financial, medical, or other
                  professional advice. You should consult with appropriate
                  professionals before making decisions based on AI-generated
                  outputs.
                </li>
                <li>
                  <strong>Evolving Technology.</strong> AI technologies are
                  continuously evolving, and the performance, capabilities, and
                  outputs of AI systems may change over time. We do not
                  guarantee consistent results or performance from AI-powered
                  features of our Services.
                </li>
                <li>
                  <strong>Third-Party AI Platforms.</strong> Certain Services may
                  utilize third-party AI platforms and APIs. The outputs from
                  such platforms are subject to the terms, limitations, and
                  policies of those third-party providers. We are not
                  responsible for the performance, availability, or outputs of
                  third-party AI systems.
                </li>
                <li>
                  <strong>Intellectual Property Considerations.</strong> The
                  intellectual property status of AI-generated content is an
                  evolving area of law. We make no representations or warranties
                  regarding the copyrightability, patentability, or other
                  intellectual property protections available for AI-generated
                  content.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="liability">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              8. Limitation of Liability
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL ELEV8 AI SOLUTIONS &amp; SERVICES, ITS OWNER, OFFICERS,
                EMPLOYEES, AGENTS, CONTRACTORS, OR AFFILIATES BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR
                EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS
                OF PROFITS, GOODWILL, DATA, USE, OR OTHER INTANGIBLE LOSSES,
                ARISING OUT OF OR IN CONNECTION WITH:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your access to or use of, or inability to access or use, the Services.</li>
                <li>Any conduct or content of any third party on or through the Services.</li>
                <li>Any content obtained from the Services, including AI-generated content.</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                <li>
                  Any errors, inaccuracies, or omissions in AI-generated
                  content, recommendations, or outputs.
                </li>
                <li>
                  Any interruption, suspension, or termination of the Services.
                </li>
              </ul>
              <p>
                IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL
                CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE
                SERVICES EXCEED THE GREATER OF (A) THE TOTAL AMOUNT PAID BY YOU
                TO US DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE
                EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED DOLLARS
                ($100.00).
              </p>
              <p>
                THE SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
                SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
              <p>
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
                CERTAIN WARRANTIES OR LIABILITY. IN SUCH JURISDICTIONS, OUR
                LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY
                LAW.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="indemnification">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              9. Indemnification
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold harmless Elev8 AI
                Solutions &amp; Services, its owner Brad Powell, and its
                employees, contractors, agents, and affiliates from and against
                any and all claims, damages, obligations, losses, liabilities,
                costs, and expenses (including but not limited to reasonable
                attorneys&apos; fees) arising from or related to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your use of and access to the Services.</li>
                <li>Your violation of any provision of these Terms.</li>
                <li>
                  Your violation of any applicable law, rule, or regulation.
                </li>
                <li>
                  Your violation of any third-party right, including any
                  intellectual property, privacy, or proprietary right.
                </li>
                <li>
                  Any claim that content or materials you provided to us caused
                  damage to a third party.
                </li>
                <li>
                  Your use, publication, distribution, or reliance upon any
                  AI-generated content produced through our Services.
                </li>
              </ul>
              <p>
                This indemnification obligation shall survive the termination or
                expiration of these Terms and your use of the Services.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="privacy">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              10. Privacy
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                Your privacy is important to us. Our collection, use, and
                disclosure of personal information is governed by our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-700 hover:underline"
                >
                  Privacy Policy
                </a>
                , which is incorporated into these Terms by reference. By using
                the Services, you consent to the collection and use of your
                information as described in the Privacy Policy.
              </p>
              <p>
                <strong>10.1 Cookies.</strong> The Site uses cookies and similar
                tracking technologies for session management, authentication,
                and to enhance your experience. By using the Site, you consent
                to our use of cookies as described in our Privacy Policy. You
                may configure your browser to reject cookies, but doing so may
                limit your ability to use certain features of the Services.
              </p>
              <p>
                <strong>10.2 Data Security.</strong> We implement
                commercially reasonable administrative, technical, and physical
                security measures to protect the personal information we
                collect. However, no method of transmission over the Internet or
                method of electronic storage is completely secure. We cannot
                guarantee the absolute security of your data.
              </p>
              <p>
                <strong>10.3 Third-Party Services.</strong> Our Services may
                integrate with third-party platforms, including Stripe for
                payment processing. Your interactions with third-party services
                are governed by the respective privacy policies and terms of
                service of those third parties.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="termination">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              11. Termination
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>11.1 Termination by You.</strong> You may terminate your
                account and stop using the Services at any time by contacting us
                at{" "}
                <a
                  href="mailto:powellb@elev8ai.com"
                  className="text-blue-700 hover:underline"
                >
                  powellb@elev8ai.com
                </a>
                . Termination of your account does not relieve you of any
                obligation to pay outstanding fees or charges incurred prior to
                termination.
              </p>
              <p>
                <strong>11.2 Termination by Us.</strong> We may terminate or
                suspend your account and access to the Services, in whole or in
                part, at our sole discretion, immediately and without prior
                notice or liability, for any reason, including but not limited
                to a breach of these Terms. Upon termination, your right to use
                the Services will immediately cease.
              </p>
              <p>
                <strong>11.3 Effect of Termination.</strong> Upon termination
                of your account or these Terms: (a) all licenses and rights
                granted to you under these Terms will immediately terminate; (b)
                you must cease all use of the Services; (c) we may delete your
                account information and any content associated with your account
                after a reasonable retention period; and (d) all provisions of
                these Terms that by their nature should survive termination
                shall survive, including but not limited to Sections 5
                (Intellectual Property), 7 (AI-Generated Content Disclaimer), 8
                (Limitation of Liability), 9 (Indemnification), and 12
                (Governing Law).
              </p>
              <p>
                <strong>11.4 Project Termination.</strong> Termination of an
                active service engagement or project is subject to the terms
                specified in the applicable service agreement. In the absence of
                a specific service agreement, either party may terminate a
                project with thirty (30) days&apos; written notice, subject to
                payment for all work completed through the date of termination.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section id="governing-law">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              12. Governing Law
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                These Terms and any disputes arising out of or related to these
                Terms or the Services shall be governed by and construed in
                accordance with the laws of the State of Florida, United States
                of America, without regard to its conflict of law provisions.
              </p>
              <p>
                Any legal action or proceeding arising under these Terms shall
                be brought exclusively in the state or federal courts located in
                Pasco County, Florida, and you hereby irrevocably consent to the
                personal jurisdiction and venue of such courts.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="disputes">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              13. Dispute Resolution
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>13.1 Informal Resolution.</strong> Before initiating any
                formal dispute resolution proceeding, you agree to first contact
                us at{" "}
                <a
                  href="mailto:powellb@elev8ai.com"
                  className="text-blue-700 hover:underline"
                >
                  powellb@elev8ai.com
                </a>{" "}
                to attempt to resolve the dispute informally. We will endeavor
                to resolve disputes in good faith within thirty (30) days of
                receiving notice of the dispute.
              </p>
              <p>
                <strong>13.2 Mediation.</strong> If the dispute cannot be
                resolved informally, both parties agree to participate in
                non-binding mediation conducted by a mutually agreed-upon
                mediator in Pasco County, Florida, before pursuing any other
                form of dispute resolution. The costs of mediation shall be
                shared equally between the parties.
              </p>
              <p>
                <strong>13.3 Binding Arbitration.</strong> If mediation is
                unsuccessful, any dispute, claim, or controversy arising out of
                or relating to these Terms shall be resolved by binding
                arbitration administered in accordance with the rules of the
                American Arbitration Association (&quot;AAA&quot;). The
                arbitration shall take place in Pasco County, Florida, and shall
                be conducted by a single arbitrator. The arbitrator&apos;s
                decision shall be final and binding, and judgment on the award
                may be entered in any court of competent jurisdiction.
              </p>
              <p>
                <strong>13.4 Class Action Waiver.</strong> YOU AND ELEV8 AI
                SOLUTIONS &amp; SERVICES AGREE THAT EACH PARTY MAY BRING
                CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL
                CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
                PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
              </p>
              <p>
                <strong>13.5 Exceptions.</strong> Notwithstanding the foregoing,
                either party may seek injunctive or other equitable relief in
                any court of competent jurisdiction to prevent the actual or
                threatened infringement, misappropriation, or violation of a
                party&apos;s copyrights, trademarks, trade secrets, patents, or
                other intellectual property rights.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="modifications">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              14. Modifications to Terms
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to modify, amend, or update these Terms at
                any time at our sole discretion. When we make changes, we will
                update the &quot;Last Updated&quot; date at the top of this
                page. For material changes, we may also provide additional
                notice, such as posting a notification on the Site or sending
                you an email.
              </p>
              <p>
                Your continued use of the Services after the effective date of
                any modifications constitutes your acceptance of the updated
                Terms. If you do not agree to the modified Terms, you must
                discontinue your use of the Services immediately.
              </p>
              <p>
                It is your responsibility to review these Terms periodically for
                changes. Material changes will not be applied retroactively to
                disputes arising before the date of the change.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="contact">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              15. Contact Information
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                If you have any questions, concerns, or requests regarding these
                Terms of Service, please contact us:
              </p>
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <p className="font-semibold text-gray-900">
                  Elev8 AI Solutions &amp; Services
                </p>
                <p className="mt-2 text-gray-700">Brad Powell, Owner</p>
                <p className="text-gray-700">
                  New Port Richey, FL 34653
                </p>
                <p className="mt-3 text-gray-700">
                  Email:{" "}
                  <a
                    href="mailto:powellb@elev8ai.com"
                    className="text-blue-700 hover:underline"
                  >
                    powellb@elev8ai.com
                  </a>
                </p>
                <p className="text-gray-700">
                  Phone:{" "}
                  <a
                    href="tel:+18138152382"
                    className="text-blue-700 hover:underline"
                  >
                    +1 (813) 815-2382
                  </a>
                </p>
                <p className="text-gray-700">
                  Website:{" "}
                  <a
                    href="https://elev8ai.org"
                    className="text-blue-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    elev8ai.org
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
              General Provisions
            </h2>
            <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Entire Agreement.</strong> These Terms, together with
                the Privacy Policy and any applicable service agreements,
                constitute the entire agreement between you and Elev8 AI
                Solutions &amp; Services regarding the subject matter hereof
                and supersede all prior and contemporaneous understandings,
                agreements, representations, and warranties.
              </p>
              <p>
                <strong>Severability.</strong> If any provision of these Terms
                is held to be invalid, illegal, or unenforceable by a court of
                competent jurisdiction, such provision shall be modified to the
                minimum extent necessary to make it valid and enforceable, or if
                modification is not possible, shall be severed from these Terms.
                The remaining provisions shall continue in full force and
                effect.
              </p>
              <p>
                <strong>Waiver.</strong> The failure of either party to enforce
                any right or provision of these Terms shall not constitute a
                waiver of such right or provision. Any waiver of any provision
                of these Terms will be effective only if in writing and signed
                by the waiving party.
              </p>
              <p>
                <strong>Assignment.</strong> You may not assign or transfer
                these Terms, or any rights or obligations hereunder, without our
                prior written consent. We may assign these Terms without
                restriction. Any attempted assignment in violation of this
                provision shall be null and void.
              </p>
              <p>
                <strong>Force Majeure.</strong> Neither party shall be liable
                for any failure or delay in performance due to causes beyond its
                reasonable control, including but not limited to acts of God,
                war, terrorism, natural disasters, pandemics, government
                actions, power failures, internet or telecommunications
                failures, or third-party service outages.
              </p>
              <p>
                <strong>Headings.</strong> The section headings in these Terms
                are for convenience only and have no legal or contractual
                effect.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Elev8 AI Solutions &amp; Services.
            All rights reserved.
          </p>
          <p className="mt-2">
            These Terms of Service were last updated on March 15, 2026.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;
