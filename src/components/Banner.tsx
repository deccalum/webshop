import '../styles/banner.css'

export default function Banner() {
  return (
    <section className="banner">
      {/* Decorative blur circles */}
      <div className="banner__decoration banner__decoration--left" />
      <div className="banner__decoration banner__decoration--right" />

      {/* Content wrapper */}
      <div className="banner__container">
        <div className="banner__content">
          <h2 className="banner__title">Stay Updated</h2>
          <p className="banner__subtitle">
            Get the latest tech drops, exclusive deals, and early access to new products.
          </p>
        </div>

        <form className="banner__form">
          <div className="banner__inputs">
            <input
              type="email"
              className="banner__input"
              placeholder="your@email.com"
              required
            />
            <button type="submit" className="banner__button">
              Subscribe
            </button>
          </div>
          <p className="banner__disclaimer">
            Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  )
}
