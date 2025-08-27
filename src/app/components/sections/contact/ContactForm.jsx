import { Button } from "app/components";
import GoogleMaps from "app/components/ui/GoogleMaps";
import Input from "app/components/ui/Input";
import Section from "app/components/ui/Section";

function ContactForm() {
  return (
    <div>
        <Section outerC="!overflow-visible bg-primary text-center text-secondary relative" innerC="max-w-[80%]">
            <h2 className="text-3xl mb-4 font-bold">Contact Us!</h2>
            <p>Lorem ipsum, dolor sit amet consectetur. distinctio error cum.</p>

            <div className="p-3 absolute -bottom-6 rotate-45 z-10 left-[50%] -translate-1/2 bg-primary"></div>
        </Section>


        <Section outerC="bg-secondary !pt-10 md:!pt-16" innerC="md:flex md:gap-10 items-center"> 
            <GoogleMaps className="w-full h-[340px] lg:h-[400px] hidden md:block"></GoogleMaps>

            <div className="w-full md:w-[80%]">
                <div className="space-y-4">
                    <Input label="Email" />
                    <Input label="Message" />
                    <Input label="Message" textarea />
                </div>
                <Button className="w-full mt-10" size="lg">Send!</Button>
            </div>
        </Section>
    </div>
  );
}

export default ContactForm;