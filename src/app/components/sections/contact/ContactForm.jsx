"use client"

import { Button } from "app/components";
import GoogleMaps from "app/components/ui/GoogleMaps";
import Input from "app/components/ui/Input";
import Section from "app/components/ui/Section";
import { useState } from "react";

import * as z from "zod";


function ContactForm() {
    const initialState = {
        name: null,
        email: null,
        subject: null,
        message: null,
        general: null,
    }

    const initialForm = {
        name: '',
        email: '',
        subject: '',
        message: '',
    }

    const [errorState, setErrorState] = useState(initialState);
    const [formData, setFormData] = useState(initialForm);
    
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false)


    const Form = z.object({ 
        name: z.string().nonempty("This field is required."),
        email: z.email("Wrong email format.").nonempty("This field is required."),
        subject: z.string().nonempty("This field is required."),
        message: z.string().nonempty("This field is required.")
    });

    const handleChange = (e) => {
        setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };
        
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            setErrorState(initialState)
            setSuccess(false)

            if (!Form.safeParse(formData).success) {
                setErrorState({ 
                    ...initialState,
                    ...z.flattenError(Form.safeParse(formData).error).fieldErrors
                })

                return;
            }

            setLoading(true)

            const res = await fetch("/api/sendMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            console.log(data.success ? "Email sent!" : "Failed to send email");
            
            if (data.success) {
                setLoading(false)
                setSuccess(true)
                setFormData(initialForm)
            } else if (res.status >= 500) {
                setLoading(false)
                setErrorState({ ...initialState, general: data.error })
            } else if (res.status === 400 && data.fieldErrors) {
                setLoading(false)
                setErrorState({ ...initialState, ...data.fieldErrors })
            } else if (data.error) {
                setLoading(false)
                setErrorState({ ...initialState, general: data.error })
            }

        } catch (err) {
            setLoading(false)
            setErrorState({
                general: "Something went wrong, please try again later."
            });
        }
    };


    return (
        <div>
            <Section outerC="!overflow-visible bg-primary text-center text-secondary relative" innerC="max-w-[80%]">
                <h2 className="text-3xl mb-4 font-bold">Contact Us!</h2>
                <p>Lorem ipsum, dolor sit amet consectetur. distinctio error cum.</p>

                <div className="p-3 absolute -bottom-6 rotate-45 z-10 left-[50%] -translate-1/2 bg-primary"></div>
            </Section>


            <Section outerC="bg-secondary !pt-10 md:!pt-16" innerC="md:flex md:gap-10 lg:gap-30 items-center"> 
                <GoogleMaps className="w-full h-[340px] lg:h-[400px] hidden md:block"></GoogleMaps>

                <form onSubmit={onSubmit} className="w-full md:w-[80%]">
                    <div className="space-y-4">
                        <div>
                            <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
                            {errorState.name && <p style={{ color: 'red' }}>{errorState.name}</p>}
                        </div>
                        <div>
                            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
                            {errorState.email && <p style={{ color: 'red' }}>{errorState.email[0]}</p>}
                        </div>
                        <div>
                            <Input label="Subject" name="subject" value={formData.subject} onChange={handleChange} />
                            {errorState.subject && <p style={{ color: 'red' }}>{errorState.subject}</p>}
                        </div>
                        <div>
                            <Input label="Message" name="message" value={formData.message} onChange={handleChange} textarea />
                            {errorState.message && <p style={{ color: 'red' }}>{errorState.message}</p>}
                        </div>
                    </div>
                    <Button disabled={loading} type="submit" className="w-full mt-10" size="lg">{loading ? <div className="h-8 w-8 mx-auto animate-spin border-t-transparent border-4 rounded-2xl"></div> : "Send!"}</Button>
                    {success && <p className="text-green-700 text-center mt-1">Message sent!</p>}
                    {errorState.general && <p className="text-center mt-1" style={{ color: 'red' }}>{errorState.general}</p>}
                </form>
            </Section>
        </div>
    );
}

export default ContactForm;