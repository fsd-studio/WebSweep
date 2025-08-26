"use client"

import { useState } from "react";
import { Lightbox } from 'yet-another-react-lightbox';
import "yet-another-react-lightbox/styles.css";
import FSDImage from "../ui/FSDImage";
import Section from "../ui/Section";
import heroMinimalist from '/public/template/400x600.png';

function Gallery() {
    const [openIndex, setOpenIndex] = useState(null);

    const images = Array.from({
        length: 12
    }, (_, i) => ({
        image: heroMinimalist,
        src: heroMinimalist.src,
        alt: "Image " + i
    }))
        
    return (
        <Section className="bg-secondary">
            <div className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid gap-4">
                {images.map((image, index) => (
                    <FSDImage
                        key={index}
                        src={image.image}
                        alt={image.alt}
                        className="cursor-pointer"
                        onClick={() => setOpenIndex(index)}
                    />
                    )             
                )}
            </div>
            <Lightbox
                open={openIndex != null}
                close={() => setOpenIndex(null)}
                slides={images}
                index={openIndex}
            />
        </Section>
    );
}

export default Gallery;