import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">



      {/* Our Commitment */}
      <section className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src={assets.about_image}
            alt="Prescripto Team"
            className="w-full h-auto rounded-2xl shadow-xl"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            Prescripto simplifies healthcare by helping individuals schedule appointments, manage records,
            and stay connected with healthcare providers. We're driven by the mission to enhance your access
            to care through innovation.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you're a first-time visitor or returning for regular care, Prescripto ensures a seamless,
            personalized experience every step of the way.
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We envision a future where healthcare is effortless and universally accessible.
            By bridging the gap between patients and healthcare providers, Prescripto creates meaningful connections that prioritize your well-being.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Prescripto?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: 'Efficiency',
              desc: 'Quick, intuitive appointment booking and smart notifications to keep you on track.',
              icon: '🕒'
            },
            {
              title: 'Convenience',
              desc: 'Easily find and connect with trusted doctors near you.',
              icon: '📍'
            },
            {
              title: 'Personalization',
              desc: 'Receive tailored recommendations and reminders for better health management.',
              icon: '💡'
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-8 text-center transition hover:shadow-2xl">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
            Join Prescripto today and experience healthcare that's simple, smart, and centered around you.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </a>
        </div>
      </section>

    </div>
  );
};

export default About;
