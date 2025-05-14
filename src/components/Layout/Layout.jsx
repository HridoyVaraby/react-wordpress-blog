import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ScrollToTop } from '../../utils/ScrollToTop'

const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout