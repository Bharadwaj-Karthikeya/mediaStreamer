import {Route, Routes, Navigate} from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import HomePages from "./pages/HomePages.jsx"
import HomeScroll from "./pages/HomeScroll.jsx"
import Watch from "./pages/Watch.jsx"
import Upload from "./pages/Upload.jsx"
import Profile from "./pages/Profile.jsx"
import Search from "./pages/Search.jsx"
import WatchHistory from "./pages/WatchHistory.jsx"
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
