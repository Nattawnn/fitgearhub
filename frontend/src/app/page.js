import './homepage.css'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="homepage">
      {/* Hero Section with background */}
      <section 
        className="hero"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dstl8qazf/image/upload/v1746793916/fzmati4eu1wq5pxecg0p.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>
            ELEVATE YOUR PERFORMANCE<br />
            <span className="thin">Equip with the Best.</span>
          </h1>
          <p>Premium fitness and sports gear for every goal.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers">
        <div className="container">
          <h2>Our Best Sellers</h2>
          <div className="products-grid">
            <div className="product-column">
              <div className="product-card">
                <Image 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png" 
                  alt="Boxing Gloves" 
                  width={382} 
                  height={532} 
                />
                <h3 className="product-title-overlay">Boxing Gloves</h3>
              </div>
              <div className="product-detail">
                <p className="product-tagline">Trusted performance for every punch.</p>
                <p className="product-description">
                  Designed for both beginners and seasoned fighters, these gloves offer solid hand protection and comfort. 
                  Sourced from reliable brands known for durability in intense training and sparring sessions.
                </p>
              </div>
            </div>

            <div className="product-column">
              <div className="product-card">
                <Image 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png" 
                  alt="Stud Shoes" 
                  width={385} 
                  height={532} 
                />
                <h3 className="product-title-overlay">Stud Shoes</h3>
              </div>
              <div className="product-detail">
                <p className="product-tagline">Built for speed and control on the field.</p>
                <p className="product-description">
                  These imported stud shoes feature excellent traction, lightweight material, and a snug fit—ideal for 
                  football or agility-focused drills. Selected for athletes who demand quick turns and grip on grass or turf.
                </p>
              </div>
            </div>

            <div className="product-column">
              <div className="product-card">
                <Image 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png" 
                  alt="Dumbbells" 
                  width={381} 
                  height={532} 
                />
                <h3 className="product-title-overlay">Dumbbells</h3>
              </div>
              <div className="product-detail">
                <p className="product-tagline">Gear for strength training at any level.</p>
                <p className="product-description">
                  Made from high-quality materials, these dumbbells are perfect for home gyms or commercial setups. 
                  Our top pick for building strength, endurance, and flexibility with trusted weight accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="categories-grid">
            <div className="category-card sport">
              <div className="category-image-wrapper">
                <Image src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746887101/zdmrctdccvhupgarac5l.png" alt="Sport" width={591} height={926} />
                <div className="category-overlay-text">
                  <h3>SPORT</h3>
                  <a href="#" className="see-more">see more →</a>
                </div>
              </div>
            </div>
            <div className="category-card fitness">
              <div className="category-image-wrapper">
                <Image src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746887116/qcw8x6sbgzeecdrs3oiz.png" alt="Fitness" width={596} height={926} />
                <div className="category-overlay-text">
                  <h3>Fitness</h3>
                  <a href="#" className="see-more">see more →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </main>
  );
}
