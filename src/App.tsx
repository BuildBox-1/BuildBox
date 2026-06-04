import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FlowStrip from './components/FlowStrip'
import ProjectGrid from './components/ProjectGrid'
import Footer from './components/Footer'
import ProjectPage from './pages/ProjectPage'
import HowToContribute from './components/Contribution'
import ContributorPage from './pages/ContributorPage'


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
      <div className="w-full max-w-281.5 mx-auto border-x border-(--border) min-h-svh flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/projects/:slug/:contributor" element={<ContributorPage />} />
          <Route path="/how-to-contribute" element={<HowToContribute />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App