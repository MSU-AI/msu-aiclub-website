import { Footer } from '~/components/landing/footer';

export default function Page() {
  return (
    <main>
      <div className="min-h-screen w-full">
        <div className="max-w-[1024px] mx-auto px-4 py-8 pt-28">
          <div className="terms pr-0  pb-10 prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
            <h1>AI Club at Michigan State University - Terms of Service</h1>

            <hr className="my-6 border-secondary sm:mx-auto lg:my-8" />

            <p>Welcome to the official website of the AI Club at Michigan State University (msuaiclub.com). By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before using our services.</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By using msuaiclub.com, you agree to these terms of service. If you do not agree to these terms, please do not use our website.</p>

            <h2>2. Purpose of the Website</h2>
            <p>The primary purpose of msuaiclub.com is to:</p>
            <ul>
              <li>Share information about the AI Club at Michigan State University</li>
              <li>Facilitate event registration for club activities</li>
              <li>Enable member communication</li>
            </ul>

            <h2>3. Membership</h2>
            <p>Membership in the AI Club at Michigan State University is open to all interested individuals. There are no specific requirements or restrictions for joining the club.</p>

            <h2>4. Information Collection</h2>
            <p>We collect the following information from users:</p>
            <ul>
              <li>Email address</li>
              <li>Name</li>
              <li>Major</li>
              <li>Personal websites</li>
              <li>Portfolio sites</li>
            </ul>
            <p>This information is collected to facilitate communication and enhance the club experience. We are committed to protecting your privacy and will only use this information for club-related purposes.</p>

            <h2>5. User Conduct</h2>
            <p>Users of msuaiclub.com are expected to behave in a respectful and appropriate manner. The following is strictly prohibited:</p>
            <ul>
              <li>Posting or sharing hateful content</li>
              <li>Engaging in any activity that disrupts the functioning of the website or the club</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>Our members may submit projects to the club. By submitting a project, you:</p>
            <ul>
              <li>Retain ownership of your original work</li>
              <li>Grant the AI Club at Michigan State University a non-exclusive, royalty-free license to display, promote, or feature your project on our website or in club activities</li>
              <li>Agree not to submit any content that infringes on the intellectual property rights of others</li>
            </ul>

            <h2>7. Disclaimer of Liability</h2>
            <p>The AI Club at Michigan State University is not responsible for any damages or losses resulting from the use of our website or participation in club activities. Use of the website and participation in club events is at your own risk.</p>

            <h2>8. Modifications to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the website after changes have been made constitutes acceptance of the modified terms.</p>

            <h2>9. Contact Information</h2>
            <p>If you have any questions or concerns about these terms, please contact us at msuaiclub@gmail.com.</p>

            <h2>10. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the State of Michigan, without regard to its conflict of law provisions.</p>

            <p>By using msuaiclub.com, you acknowledge that you have read, understood, and agree to be bound by these terms of service.</p>

            <p>Last updated: 8/25/2024</p>
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
