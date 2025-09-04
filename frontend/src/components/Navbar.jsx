import React from 'react'
import { useSelector } from 'react-redux'
import PrivateNav from './Navbar/PrivateNav';
import PublicNav from './Navbar/PublicNav';

const Navbar = () => {

  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {
        user ? <PrivateNav /> : <PublicNav />
      }
    </>
  )
}

export default Navbar
