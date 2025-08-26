import Head from "next/head";
import Gallery from "./components/sections/Gallery";
import Nav from './components/sections/Nav';
import HeroMinimalist from "./components/sections/hero/HeroMinimalist";
import Menu from "./components/sections/Menu";
import MapInfo from './components/sections/contact/MapInfo';
import Footer from './components/sections/footer/Footer';
import HeroTextImage from './components/sections/hero/HeroTextImage';

export default function Home() {
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
        {/* <Nav></Nav> */}

        <Menu></Menu>

        {/* <Hero></Hero> */}
        {/* <HeroMinimalist></HeroMinimalist> */}

        <HeroTextImage></HeroTextImage>

        <MapInfo></MapInfo>
        {/* <Info></Info> */}

        <Gallery></Gallery>

        <Footer></Footer>
      </div>
    </>
  );
}
