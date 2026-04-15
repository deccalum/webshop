import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProductList from './components/Productlist'
import Banner from './components/Banner'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Sidebar />
        <ProductList />
      </main>
      <Banner />
      <Footer />
    </>
  )
}

export default App
