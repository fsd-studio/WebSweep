import FSDImage from './../../ui/FSDImage';
import Section from './../../ui/Section';
import Image from '/public/template/burger.png';

function HeroTextImage({
  title = "Your Brand",
  buttonText = "Reserve now",
  buttonLink = "#Reserve",
  src = Image
}) {
  return (
    <Section outerC="bg-orange-200 relative">
        {/* Floating orbs */}
        <div className='w-100 h-100 hidden -bottom-30 -left-20 md:block lg:bottom-auto lg:top-30 lg:-left-60 rounded-full bg-red-600/50 absolute'></div>
        <div className='w-100 h-100 hidden -top-30 -right-30 md:block lg:top-auto lg:-bottom-10 lg:-right-60 rounded-full bg-green-600/50 absolute'></div>

        <div className='text-center md:text-start lg:text-center mt-12 md:mt-16 lg:mt-6 mb-10 max-w-[80%] mx-auto'>
            <h1 className='text-7xl md:text-[60px] lg:text-9xl lg:uppercase font-black'>{title}</h1>
            <h2 className='text-xl md:text-2xl mt-8 w-[50%] hidden md:block lg:hidden'>Affordable, high-quality web design with <span className='font-bold '>transparent</span> communication.</h2>
        </div>
        <FSDImage
            src={src}
            alt="burger"
            quality={100}
            placeholder="blur"
            className="drop-shadow-[0_0_100px_rgba(251,191,36,0.6)] w-full -mt-14 md:-mt-4 lg:-mt-20 md:ms-auto lg:mx-auto md:w-[90%] lg:w-[40%] lg:relative lg:z-10"
        />

        <h2 className='text-xl w-[90%] mx-auto text-center mt-6 md:hidden lg:block'>Affordable, high-quality web design with <span className='font-bold '>transparent</span> communication.</h2>
    </Section>
  );
}

export default HeroTextImage;
