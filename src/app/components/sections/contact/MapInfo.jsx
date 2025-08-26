import GoogleMaps from './../../ui/GoogleMaps';
import Section from './../../ui/Section';

function MapInfo({
    location = "country, city 2640, street 24",
    phoneNumber = "+32 492 10 12 76",
    email = "info@fsd-studio.com",
}) {
  return (
    <Section innerC="flex flex-col md:flex-row gap-10">
        <GoogleMaps></GoogleMaps>

        <div className='text-center space-y-3'>
            <p>{location}</p>
            <p>{phoneNumber}</p>
            <p>{email}</p>
        </div>
    </Section>
  );
}

export default MapInfo;