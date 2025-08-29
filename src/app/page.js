'use client'

import Head from "next/head";
import Gallery from './components/sections/Gallery';
import Nav from './components/sections/Nav';
import HeroMinimalist from "./components/sections/hero/HeroMinimalist";
import Menu from "./components/sections/menu/Menu";
import MapInfo from './components/sections/contact/MapInfo';
import ContactForm from "./components/sections/contact/ContactForm";
import Footer from './components/sections/footer/Footer';
import HeroTextImage from './components/sections/hero/HeroTextImage';
import MenuElegant from "./components/sections/menu/MenuElegant";
import { productService } from '../services/api';
import { useEffect, useState } from "react";


export default function Home() {
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllRestaurants();
        setRestaurantData(response.data);
        console.log(response.data[0].name);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>title</title>
        <meta name="description" content="Write a short but effective description related to this page" />

        {/* meta data for link sharing */}
        <meta property="og:title" content="title" />
        <meta property="og:description" content="Write a short but effective description related to this page" />
        <meta property="og:image" content="https://www.fsd-studio.com/LOGO-PRIMARY.png" />
        <meta property="og:url" content="https://fsd-studio.com/" />
        <meta property="og:type" content="website" />

        

        {/* This will define the prefered site version to avoide duplicate content
            
            Example:  https://fsd-studio.com/ and https://fsd-studio.com/#about will both show up in results. 
            
            canonical defines which link is prefered.
        */}

        {/* <link rel="canonical" href="https://fsd-studio.com/" /> */}
       
        {/* Don't change */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div>
        {restaurantData && <p>{restaurantData[0].name}</p>} 
        {/* <Nav></Nav> */}

        {/* <Menu></Menu> */}
        <MenuElegant />     
        <Nav></Nav>

        <HeroTextImage></HeroTextImage>

        <ContactForm></ContactForm>

        <Gallery></Gallery>

        <Footer></Footer>
      </div>
    </>
  );
}
