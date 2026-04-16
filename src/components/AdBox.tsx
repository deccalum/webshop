import '../styles/adbox.css'

export default function AdBox() {
  return (
    <div className="adbox">
      <p className="adbox__label">This week</p>
      <h3 className="adbox__title">Free Shipping</h3>
      <p className="adbox__body">On all orders over 1 000 kr.</p>
      <button className="adbox__btn">Request Code</button>
    </div>
  )
}
