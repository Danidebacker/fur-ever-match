import React from "react";
import "./Footer.scss";

import facebookIcon from "../assets/images/Facebook.svg";
import instagramIcon from "../assets/images/Instagram.svg";
import twitterIcon from "../assets/images/X_twitter.svg";
import pinterestIcon from "../assets/images/Pinterest.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__top">
          <div className="footer__columns">
            <div className="footer__column footer__logo-column">
              <h2 className="footer__logo">🐾Fur-Ever Match🐾</h2>
            </div>

            <div className="footer__column footer__contact-column">
              <h3>Contact</h3>
              <ul>
                <li>Email: info@furevermatch.com</li>
                <li>Phone: (647) 123-4567</li>
              </ul>
            </div>

            <div className="footer__column footer__privacy-column">
              <h3>Privacy</h3>
              <ul>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__social">
          <img src={facebookIcon} alt="Facebook" className="social-icon" />
          <img src={twitterIcon} alt="Twitter" className="social-icon" />
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
          <img src={pinterestIcon} alt="Pinterest" className="social-icon" />
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2024 Fur-Ever Match. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
