import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="newsletter">
          <h4>Join Our Newsletter</h4>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Submit</button>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h6>FITGEARHUB</h6>
            <ul>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Service</h6>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Newsletters</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Legal</h6>
            <ul>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Do Not Sell</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h6>Region</h6>
            <div className="region-selector">
              <span>Thailand (THB)</span>
            </div>
            <h6>Follow us</h6>
            <div className="social-links">
              <a href="#" className="social-icon">FB</a>
              <a href="#" className="social-icon">TW</a>
              <a href="#" className="social-icon">IG</a>
              <a href="#" className="social-icon">YT</a>
              <a href="#" className="social-icon">PT</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="logo">FitGearHub</div>
          <p>©2025 FitGearHub</p>
        </div>
      </div>
    </footer>
  );
}
