import { Heart, Eye, Plus } from 'lucide-react'
import '../styles/card.css'

interface CardProps {
  id: number
  title: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  image: string
  badge?: string
  inStock: boolean
}

export default function Card({
  id,
  title,
  category,
  price,
  originalPrice,
  rating,
  image,
  badge,
  inStock,
}: CardProps) {
  return (
    <article className="card">
      <div className="card__image-wrapper">
        <img src={image} alt={title} className="card__image" />

        {badge && <span className="card__badge">{badge}</span>}

        <button className="card__favorite" aria-label="Add to favorites">
          <Heart size={18} />
        </button>

        {inStock && (
          <div className="card__actions">
            <button className="card__action-btn" aria-label="Quick view">
              <Eye size={18} />
            </button>
            <button className="card__action-btn" aria-label="Add to cart">
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="card__content">
        <div className="card__meta">
          <span className="card__category">{category}</span>
          <div className="card__rating">
            <span className="card__star">★</span>
            <span>{rating}</span>
          </div>
        </div>

        <h3 className="card__title">{title}</h3>

        <div className="card__footer">
          <div className="card__prices">
            {originalPrice && <span className="card__original-price">{originalPrice} kr</span>}
            <span className="card__price">{price} kr</span>
          </div>
          <button className="card__add-btn" disabled={!inStock}>
            {inStock ? 'Add to cart' : 'Notify me'}
          </button>
        </div>
      </div>
    </article>
  )
}
