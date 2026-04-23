import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ShopPage from './pages/Shop'
import CartPage from './pages/Cart'
import { ShopFiltersProvider } from './features/shop/state'

function App() {
  return (
    <ShopFiltersProvider>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
        <Footer />
      </>
    </ShopFiltersProvider>
  )
}

export default App
