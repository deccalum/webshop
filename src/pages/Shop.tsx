import Sidebar from '../components/Sidebar'
import ProductList from '../components/Productlist'
import Banner from '../components/Banner'
import '../styles/shop.css'

export default function ShopPage() {
  return (
    <>
      <main className="shop-layout">
        <Sidebar />
        <ProductList />
      </main>
      <Banner />
    </>
  )
}
