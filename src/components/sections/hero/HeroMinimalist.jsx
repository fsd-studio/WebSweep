
import Section from '../../ui/Section';
function HeroMinimalist({
  title = "Your Brand",
  subTitle = "Affordable, high-quality web design with transparent communication.",
  buttonText = "Reserve now",
  buttonLink = "#Reserve"
}) {
  return (
    <div className="bg-secondary w-full">
      {/* Content */}
      <Section outerC="!pt-10">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-14 md:gap-8 lg:gap-20">
            <div className="md:col-span-2 order-2 md:order-1">
                <div className="text-primary space-y-12 text-center md:text-start w-[80%] mx-auto md:w-full">
                    <h2 className="font-semibold font-primary underline-offset-2 underline text-xl">MAKE A RESERVATION</h2>
                    <div>
                        <h2 className="font-semibold text-xl mb-6">LOCATION</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, tempore.</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-6">OPENING HOURS</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, tempore.</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-6">CONTACT</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, tempore.</p>
                    </div>
                </div>
            </div>
            
            <div className="md:order-2 md:col-span-6">
                <img className="object-cover w-full h-120 md:h-[600px]" src="/template/heroMinimalist.png" alt="" />
            </div>
        </div>
      </Section>
    </div>
  );
}

export default HeroMinimalist;
