import { Link } from 'react-router-dom'
import { Model } from '../../../types/Model'
import './ModelCard.module.css'

interface ModelCardProps {
  model: Model
}

const ModelCard = ({ model }: ModelCardProps) => {
  return (
    <Link to={`/model/${model.id}`} className="profile-card">
      <div className="profile-image-container">
        <img 
          src={model.photos[0]} 
          alt={`${model.name}, ${model.age} лет - ${model.location}`}
          className="profile-image"
          loading="lazy"
        />
        <div className="profile-badges">
          {model.newThisWeek && <span className="profile-badge new">NEW</span>}
          {model.vip && <span className="profile-badge vip">VIP</span>}
          {model.verified && <span className="profile-badge real">REAL</span>}
        </div>
        <div className="profile-overlay">
          <div className="profile-info">
            <div className="profile-name">{model.name}, {model.age} лет</div>
            <div className="profile-location">{model.location}</div>
          </div>
          <svg className="profile-heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default ModelCard

