import { Link } from 'react-router-dom'
import { SiX, SiFacebook } from "react-icons/si";
import { MdComputer } from "react-icons/md";
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* Brand Column */}
        <div className="footer__brand-section">
          <Link className="footer__brand" to="/">
            <span className="footer__brand-icon">
              <MdComputer size={20} />
            </span>
            <span>BYTE.SHOP</span>
          </Link>
          <p className="footer__tagline">
            Premium tech products and components for builders and creators.
          </p>
          <div className="footer__socials">
            <a href="https://x.com" className="footer__social" aria-label="X">
              <SiX size={18} />
            </a>
            <a href="https://facebook.com" className="footer__social" aria-label="Facebook">
              <SiFacebook size={18} />
            </a>
          </div>
        </div>

        {/* Nav Sections */}
        <div className="footer__nav-section">
          <div className="footer__nav-group">
            <h4 className="footer__nav-title">Shop</h4>
            <nav className="footer__nav-links">
              <Link to="/new">New Drops</Link>
              <Link to="/laptops">Laptops</Link>
              <Link to="/peripherals">Peripherals</Link>
              <Link to="/sale">Sale</Link>
            </nav>
          </div>

          <div className="footer__nav-group">
            <h4 className="footer__nav-title">Support</h4>
            <nav className="footer__nav-links">
              <a href="#">Contact Us</a>
              <a href="#">FAQ</a>
              <a href="#">Shipping Info</a>
              <a href="#">Returns</a>
            </nav>
          </div>

          <div className="footer__nav-group">
            <h4 className="footer__nav-title">Company</h4>
            <nav className="footer__nav-links">
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Press</a>
            </nav>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        <p className="footer__copyright">© 2024 BYTE.SHOP. All rights reserved.</p>
        <div className="footer__legal">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Terms of Service</a>
          <span>•</span>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}
