import React from 'react';
import './Home.css';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-section"
      >
        <h1 className="hero-heading">AI That Calls for You, Manages Your CRM, and Empowers Your Business</h1>
        <p className="hero-subheading">Revolutionize your customer management with smart automation and save cost.</p>
      </motion.section>

      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3, duration: 1 }}
  className="cta-button-container"
  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
>
  <motion.a
    href="/demo"
    className="cta-demo-button"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    style={{
      display: 'inline-block',
      padding: '15px 30px',
      margin: '30px',
      backgroundColor: '#ff5722', // Choose your preferred color
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: 'bold',
      borderRadius: '8px',
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease-in-out',
    }}
  >
    Create and Test your AI Employee in 2 Minutes!
  </motion.a>
</motion.div>


      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="features-section"
      >
        <h2 className="section-heading">Our Key Features</h2>
        <div className="features-grid">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h3>Sales Automation</h3>
            <p>Never let leads slip away. Automate your sales process, nurture leads, and maximize conversions.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h3>Appointment Management</h3>
            <p>Automate booking, manage schedules, and follow up effortlessly with clients and customers.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h3>Payment Reminders</h3>
            <p>Improve cash flow by sending automatic payment reminders and ensure timely collections.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h3>Unified Communication</h3>
            <p>Integrate your CRM, phone, WhatsApp, SMS, and email into one seamless platform.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="feature-card"
          >
            <h3>Customer Support Automation</h3>
            <p>Provide instant support, handle pre-sales and post-sales inquiries, and delight your customers with personalized automation.</p>
          </motion.div>
        </div>
      </motion.section>

     {/* Use Cases Section */}
<motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1, duration: 1 }}
  className="use-cases-section"
>
  <h2 className="section-heading">Real-World Applications</h2>
  <div className="use-cases-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
    {[
      { title: "Healthcare & Wellness", description: "Manage patient appointments, automate follow-ups, and provide seamless support for hospitals, clinics, spas, and wellness centers." },
      { title: "Financial Services", description: "Automate payment reminders, follow-ups, and streamline customer service for banks, insurance, and financial institutions." },
      { title: "Real Estate & Property Management", description: "Nurture leads from social media, engage potential buyers, and manage property inquiries with ease." },
      { title: "Customer Support & E-commerce", description: "Provide after-sales support, answer product inquiries, and manage customer concerns efficiently for tech support and e-commerce businesses." },
      { title: "Fitness & Memberships", description: "Automate follow-ups and manage memberships for gyms and fitness centers, ensuring no potential member is missed." },
      { title: "Centralized Info Centers", description: "Provide a unified chat and call center for colleges, companies, and other institutions, centralizing customer inquiries." },
    ].map((useCase, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
        whileHover={{ y: -10, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)', backgroundColor: '#f9f9f9' }}
        className="use-case-card"
        style={{
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <h3 style={{ marginBottom: '10px', color: '#ff5722' }}>{useCase.title}</h3>
        <p style={{ lineHeight: '1.6' }}>{useCase.description}</p>
      </motion.div>
    ))}
  </div>
</motion.section>

      {/* Call-to-Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="cta-section"
      >
        <h2 className="cta-heading">Ready to Transform Your CRM Experience?</h2>
        <p className="cta-subheading">Reach out to us today and discover how we can empower your business!</p>
        <motion.a
          href="https://cal.com/sibinarendran/get-your-own-ai-call-agent?date=2024-10-06&month=2024-10"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button-container"
        >
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            className="cta-button"
          >
            Contact Us
          </motion.button>
        </motion.a>
      </motion.section>

      {/* Footer Section */}
      <footer className="footer-section">
        <p>© 2024 Maaya.ai. All rights reserved.</p>
        <p>Contact: sibinarendran@gmail.com</p>
      </footer>
    </div>
  );
}

export default Home;