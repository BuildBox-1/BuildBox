import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlowStrip from './components/FlowStrip'
import ProjectGrid from './components/ProjectGrid'
import Footer from './components/Footer'
import HowToContribute from './components/Contribution'
import ProjectPage from './pages/ProjectPage'


function Landing() {
  return (
    <>
      <Hero />
      <FlowStrip />
      <ProjectGrid />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="w-full max-w-[1126px] mx-auto border-x border-(--border) min-h-svh flex flex-col">

        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/how-to-contribute" element={<HowToContribute />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App