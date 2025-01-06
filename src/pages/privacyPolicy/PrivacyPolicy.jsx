/*
 * Project Name: Salt & Pepper
 * Group: Group 15
 * University: University of Plymouth
 * Course: BSc (Hons) Software Engineering
 * Author(s): Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera
 *
 * Copyright (c) 2024 [Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera]. All rights reserved.
 *
 * This code is the property of the authors and may not be reproduced, distributed, or
 * used without permission from the copyright holder(s).
 */

import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Terms of Use & Privacy Policy</h1>
      <p>Last updated: December 30, 2024</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Salt & Pepper. Your privacy is important to us. This
          document outlines our Terms of Use and Privacy Policy, explaining how
          we collect, use, and protect your information when you use our
          services.
        </p>
      </section>

      <section>
        <h2>2. Terms of Use</h2>
        <h3>2.1 Acceptance of Terms</h3>
        <p>
          By accessing or using our services, you agree to comply with and be
          bound by these Terms of Use. If you do not agree, please do not use
          our services.
        </p>

        <h3>2.2 Use of Services</h3>
        <ul>
          <li>Users must be at least 18 years old or have parental consent.</li>
          <li>
            You agree not to use our services for any unlawful or prohibited
            activities.
          </li>
          <li>
            Unauthorized access or interference with our platform is strictly
            prohibited.
          </li>
        </ul>

        <h3>2.3 Intellectual Property</h3>
        <p>
          All content provided through our platform, including but not limited
          to text, graphics, and software, is the property of Salt & Pepper or
          its licensors and is protected by copyright laws.
        </p>

        <h3>2.4 Limitation of Liability</h3>
        <p>
          Salt & Pepper shall not be held liable for any indirect, incidental,
          or consequential damages arising from your use of our services.
        </p>
      </section>

      <section>
        <h2>3. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address,
          phone number, and payment details. We also collect non-personal
          information like device details, browser type, and usage data to
          improve our services.
        </p>
      </section>

      <section>
        <h2>4. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our services.</li>
          <li>To process transactions and send updates.</li>
          <li>To improve our platform based on user feedback.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>5. Sharing Your Information</h2>
        <p>
          We do not sell your personal data to third parties. However, we may
          share your data with trusted service providers who assist in
          delivering our services, subject to strict confidentiality agreements.
        </p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. Please contact us at
          <a href="mailto:privacy@saltandpepper.com">
            privacy@saltandpepper.com
          </a>
          for any privacy-related requests.
        </p>
      </section>

      <section>
        <h2>7. Data Security</h2>
        <p>
          We implement robust security measures to protect your data. However,
          no method of transmission over the internet is 100% secure, and we
          cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We reserve the right to update this document at any time. Changes will
          be effective immediately upon posting on this page.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Use or our Privacy
          Policy, please contact us at:
        </p>
        <address>
          Email:
          <a href="mailto:privacy@saltandpepper.com">
            privacy@saltandpepper.com
          </a>
          <br />
          Address: 123 Software Avenue, Plymouth, UK
        </address>
      </section>
    </div>
  );
};
// TODO: Change address and contact details
export default PrivacyPolicy;
