import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[url('/src/assets/mainBg.png')] bg-cover bg-center bg-no-repeat">
        <Outlet />
      </main>
      <Footer />    
    </>
  )
}
