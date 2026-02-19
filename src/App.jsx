import {Route, Routes, Navigate} from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import HomePages from "./pages/HomePages"
import HomeScroll from "./pages/HomeScroll"
import Watch from "./pages/Watch"
import Upload from "./pages/Upload"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import WatchHistory from "./pages/WatchHistory"
import './App.css'

function App() {

  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<Home /> }/> */}
        {/* <Route path="/" element={<HomePages /> }/> */}
        <Route path="/" element={<HomeScroll /> }/>
        <Route path="/watch" element={<Watch /> }/>
        <Route path="/watch/:id" element={<Watch /> }/>
        <Route path="/upload" element={<Upload /> }/>
        <Route path="/profile" element={<Profile /> }/>
        <Route path="/search" element={<Search /> }/> 
        <Route path="/history" element={<WatchHistory /> }/>
      </Routes>
    </Layout>
  )
}

export default App
