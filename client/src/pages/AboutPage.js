import React from 'react';

const AboutPage = () => (
  <div>
    <h1>About SafeSend</h1>
    <h2>Why it's important</h2>

    <p>
      Information is sent through the web every day. To ensure that information, particularly
      sensitive information – such as credit card information and passwords – is not compromised,
      our 2-Factor-Authenticated service encrypts the data that is being sent. The recipient must
      have BOTH the code texted to them, and the URL that is emailed to them. This second shell of
      defense protects your information against identity theft and other harmful acts by those who
      might profit off your data.
    </p>

    <p>
      SafeSend adheres to several regulatory standards for secure data, including{' '}
      <a href="https://www.wikiwand.com/en/Payment_Card_Industry_Data_Security_Standard">
        PCI-DSS
      </a>{' '}
      and
      <a href="https://www.wikiwand.com/en/Health_Insurance_Portability_and_Accountability_Act">
        HIPAA
      </a>. Your encrypted data never touches our servers.
    </p>
  </div>
);

export default AboutPage;
