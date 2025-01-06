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
import { assets } from "../../assets/assets";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1 className="title">Welcome to Salt and Peppers.</h1>
      <p className="title-slogan">
        Your ultimate destination for fresh, high-quality, and delicious food
        items, offering a wide variety to satisfy every craving! Explore a world
        of culinary delights with us, where every product tells a story of
        quality, passion, and care.
      </p>

      <section class="mission-section">
        <div class="text-content">
          <h2>Our Mission</h2>
          <p>
            At Salt and Peppers, our mission is to redefine the way you shop for
            food. We are passionate about bringing you a curated selection of
            fresh and premium products, sourced from the best suppliers and
            local producers. Here’s how we aim to make a difference:
          </p>
          <ul class="ul-styles">
            <li>
              <strong>Fresh and Premium Food Products:</strong> Connecting you
              to top-quality items with a seamless shopping experience.
            </li>
            <li>
              <strong>Convenience and Accessibility:</strong> Shop anytime,
              anywhere, and get your favorite food delivered to your doorstep.
            </li>
            <li>
              <strong>User-Friendly Design:</strong> Our platform is intuitive,
              ensuring an effortless shopping experience for all users.
            </li>
            <li>
              <strong>Community Building:</strong> Bridging the gap between food
              lovers and local producers to celebrate the joy of food together.
            </li>
          </ul>
        </div>
        {/* // TODO: LOGO */}
        <img src={assets.logo} alt="" className="logo-image" />
      </section>

      <section>
        <h2>Why Choose Us?</h2>
        <p>
          Salt and Peppers is more than just an e-commerce platform; it’s a
          community-driven initiative that combines technology, innovation, and
          a deep love for quality food. Here’s why we stand out:
        </p>
        <ul className="ul-styles">
          <li>
            <strong>Cutting-Edge Technology:</strong> Built on the MERN stack
            (MongoDB, Express.js, React.js, Node.js), our platform is reliable,
            fast, and scalable.
          </li>
          <li>
            <strong>Customer-Centric Features:</strong> Enjoy secure payments,
            personalized recommendations, and more features tailored to your
            needs.
          </li>
          <li>
            <strong>Sustainability:</strong> Supporting local food producers and
            eco-friendly practices to protect our planet.
          </li>
          <li>
            <strong>Competitive Pricing:</strong> Delivering the best value for
            your money without compromising on quality.
          </li>
          <li>
            <strong>Exceptional Support:</strong> Our dedicated customer support
            team ensures you always have the help you need.
          </li>
        </ul>
        <img
          src="/why-choose-us.jpg"
          alt="Why Choose Us"
          className="section-image"
        />
      </section>

      <section>
        <h2>Our Vision</h2>
        <p>
          We dream of a world where fresh, quality food is accessible to all,
          and local producers are empowered to thrive. Our vision is to create a
          platform that bridges the gap between producers and consumers while
          promoting sustainability and innovation in every step.
        </p>
        <p>
          By fostering strong connections within the food community, we aim to
          transform the shopping experience and support ethical, eco-friendly
          practices for a healthier planet.
        </p>
      </section>

      <section>
        <h2>Meet the Team</h2>
        <p>
          Behind Salt and Peppers is a team of passionate individuals dedicated
          to creating an exceptional platform for food enthusiasts. As students
          of the <strong>PUSL3120 Full-Stack Module</strong>, we’ve embraced the
          MERN stack to bring our vision to life.
        </p>
        <p>
          Our team consists of creative front-end designers, skilled back-end
          developers, and strategic thinkers. Together, we’ve combined our
          expertise and dedication to build a platform that celebrates food and
          community.
        </p>
        <div class="team-section">
          <img
            src="/team.jpg"
            alt="Meet the Team"
            className="section-image-mini"
          />
          <div className="team-members">
            Team Members:
            <div className="team-member">member 1</div>
            <div className="team-member">member 2</div>
            <div className="team-member">member 3</div>
            <div className="team-member">member 4</div>
            <div className="team-member">member 5</div>
            <div className="team-member">member 6</div>
          </div>
        </div>
      </section>

      <section className="plans-section">
        <div className="text-content">
          <h2>Future Plans</h2>
          <p>
            At Salt and Peppers, our journey has just begun. We are constantly
            innovating and striving to make your shopping experience even
            better. Here’s a glimpse into what lies ahead:
          </p>
          <ul className="ul-styles">
            <li>
              <strong>Expanding Our Product Range:</strong> Adding more diverse
              food items to cater to every preference and dietary need.
            </li>
            <li>
              <strong>Enhancing User Experience:</strong> Introducing advanced
              features like AI-powered recommendations and seamless navigation.
            </li>
            <li>
              <strong>Promoting Local Producers:</strong> Partnering with more
              local farmers and businesses to support sustainability and
              authenticity.
            </li>
            <li>
              <strong>Going Global:</strong> Scaling our platform to reach
              international audiences while maintaining our core values of
              quality and community.
            </li>
          </ul>
        </div>
        <img src="/plans.jpg" alt="Future Plans" className="section-image" />
      </section>

      <section>
        <h2>Our Core Values</h2>
        <p>
          Our core values are the guiding principles that define our identity
          and shape our journey:
        </p>
        <ul className="ul-styles">
          <li>
            <strong>Integrity:</strong> Honesty and transparency in everything
            we do.
          </li>
          <li>
            <strong>Innovation:</strong> Constantly improving and staying ahead.
          </li>
          <li>
            <strong>Customer Focus:</strong> Keeping our customers at the heart
            of our operations.
          </li>
          <li>
            <strong>Collaboration:</strong> Building meaningful relationships
            within our team and the community.
          </li>
          <li>
            <strong>Sustainability:</strong> Striving to reduce our
            environmental footprint and promote ethical practices.
          </li>
        </ul>
      </section>

      <footer>
        <p>
          Thank you for choosing Salt and Peppers! We are thrilled to embark on
          this journey with you. Let’s create a community where great food,
          innovation, and sustainability come together. Your support inspires us
          to continue growing and delivering the best.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
