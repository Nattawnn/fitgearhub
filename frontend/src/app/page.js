import './homepage.css'
import Image from 'next/image'
import Link from 'next/link'

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
          <Link href="/catalog">
            <button className="shop-now-btn">Shop Now</button>
          </Link>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers">
        <div className="container">
          <h2>Our Best Sellers</h2>
          <div className="products-grid">
            <div className="product-column">
              <div className="product-card">
                <img 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800160/b2zemgektesep1nqfirh.png" 
                  alt="Boxing Gloves" 
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
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
                <img 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800238/vhorpxgcge2ommmcy3pl.png" 
                  alt="Stud Shoes" 
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
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
                <img 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746800242/ucobyaucgrxgvyksfm5a.png" 
                  alt="Dumbbells" 
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover' }}
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
                <img 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746887101/zdmrctdccvhupgarac5l.png" 
                  alt="Sport" 
                  width="100%" 
                  height="100%" 
                  style={{ objectFit: 'cover' }}
                />
                <div className="category-overlay-text">
                  <h3>SPORT</h3>
                  <a href="#" className="see-more">see more →</a>
                </div>
              </div>
            </div>
            <div className="category-card fitness">
              <div className="category-image-wrapper">
                <img 
                  src="https://res.cloudinary.com/dstl8qazf/image/upload/v1746887116/qcw8x6sbgzeecdrs3oiz.png" 
                  alt="Fitness" 
                  width="100%" 
                  height="100%" 
                  style={{ objectFit: 'cover' }}
                />
                <div className="category-overlay-text">
                  <h3>Fitness</h3>
                  <a href="#" className="see-more">see more →</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
