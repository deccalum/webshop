import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ShopPage from './pages/Shop'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ShopPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
