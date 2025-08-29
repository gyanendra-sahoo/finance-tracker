import React from 'react'
import Hero from '../components/Home/Hero'
import Feature from '../components/Home/Feature'
import Showcase from '../components/Home/ShowCase'
import Reason from '../components/Home/Reason'
import Testimonial from '../components/Home/Testimonial'
import Tracking from '../components/Home/Tracking'
import DownloadApp from '../components/Home/DownloadApp'
import Newsletter from '../components/Home/Newsletter'

const Home = () => {
  return (
    <>
      <Hero />
      <Feature />
      <Showcase />
      <Reason />
      <Tracking />
      <Testimonial />
      <DownloadApp />
      <Newsletter />
    </>
  )
}

export default Home
