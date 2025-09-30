import Button from "../../ui/Button";

function Hero({
  title = "Your Brand",
  subTitle = "Affordable, high-quality web design with transparent communication.",
  buttonText = "Reserve now",
  buttonLink = "#Reserve"
}) {
  return (
    <div className="relative w-full h-screen overflow-hidden z-10">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/template/restaurant.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (contrast) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-20 px-6 text-center text-white flex flex-col justify-center items-center h-full">
        <h1 className="font-serif mb-4 text-4xl sm:text-7xl">{title}</h1>
        <h2 className="mb-6 md:text-2xl md:max-w-[60%] mx-auto">{subTitle}</h2>
        <a href={buttonLink}>
          <Button className="md:hidden" variant="secondary" outline={true}>{buttonText}</Button>
          <Button className="hidden mx-auto md:block" variant="secondary" size="lg" outline={true}>{buttonText}</Button>
        </a>
      </div>
    </div>
  );
}

export default Hero;
