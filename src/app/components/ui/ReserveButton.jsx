import { FaCalendarAlt } from 'react-icons/fa';
import Section from './Section';

function ReserveButton() {
  return (
    <Section innerC="">
      <div className='fixed w-[80%] ms-auto'>
        <div className="bg-primary h-90 w-full mb-2 rounded-4xl">

        </div>

        <div className="p-4 bg-primary ms-auto w-fit border-6 border-blue-900 rounded-full z-50">
            <FaCalendarAlt className='w-8 text-secondary h-auto'/>
        </div>
      </div>
    </Section> 
  );
}

export default ReserveButton;