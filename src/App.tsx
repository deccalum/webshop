import Header from './components/Header'
import Main from './components/Main'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import ProductList from './components/Productlist'
import Banner from './components/Banner'


function App() {
  return (
    <>
      <Header />
      <Main>
        <Sidebar />
        <ProductList />
      </Main>
      <Banner />
      <Footer />
    </>
  )
}

export default App
