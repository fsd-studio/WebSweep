import { FaPhoneAlt } from 'react-icons/fa';
import { FaLocationPin } from 'react-icons/fa6';
import { LuMail } from 'react-icons/lu';
import Button from '../../ui/Button';
import GoogleMaps from '../../ui/GoogleMaps';
import Section from '../../ui/Section';


function MapInfo({ 
    location = "country, city 2640, street 24",
    phoneNumber = "+32 492 10 12 76",
    email = "info@fsd-studio.com",
}) {

    const info = [
        [location, <FaLocationPin className='w-5 h-auto text-secondary'></FaLocationPin>],
        [email, <LuMail className='w-5 h-auto text-secondary'></LuMail>],
        [phoneNumber, <FaPhoneAlt className='w-5 h-auto text-secondary'></FaPhoneAlt>],
    ]

    return (
        <Section innerC="flex flex-col md:flex-row gap-12 lg:justify-evenly items-center">
            <GoogleMaps className="w-full md:w-[70%] lg:w-[50%] h-[400px]"></GoogleMaps>

            <div className='text-center md:text-end space-y-6 w-full md:w-auto font-semibold text-lg'>
                {info.map(([item, icon], index) => (
                    <div key={index} className='flex items-center justify-between md:gap-10'>
                        <div className='p-3 ring-1 ring-offset-3 rounded-full bg-primary'>
                            {icon}
                        </div>
                        <p>{item}</p>
                    </div>
                ))}
                <div className='space-y-3 !mt-12 hidden md:block'>
                    <Button className='w-full'>Reserve Now</Button>
                    <Button className='w-full' outline>Order Now</Button>
                </div>
            </div>
        </Section>
    );
}

export default MapInfo;