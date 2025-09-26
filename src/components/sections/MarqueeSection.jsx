import FSDImage from "components/ui/FSDImage";
import Marquee from "react-fast-marquee";



function MarqueeSectionText({
  texts = ["Sample Text 1", "Sample Text 2", "Sample Text 3"],
  hoverToStop = true,
}) {
  return (
    <>
      <Marquee className="bg-primary/30 py-8" autoFill={true} pauseOnHover={hoverToStop} gradient={false} speed={50}>
          {texts.map((text, index) => (
            <span key={index} className="font-semibold mx-8">
              {text}
            </span>
          ))}
      </Marquee>
    </>
  );
}

export function MarqueeSectionImage(
  texts = ["Sample Text 1", "Sample Text 2", "Sample Text 3"],
  hoverToStop = true,
  gradient = false,
  
  speed = 50,
) {
  return (
    <>
      <Marquee className="bg-primary/30 py-8" autoFill={true} pauseOnHover={hoverToStop} gradient={gradient} speed={speed}>
        <div className="flex items-center space-x-4 ms-4">
          <FSDImage src="/template/600x400.png" alt="Item 1" />
          <FSDImage src="/template/600x400.png" alt="Item 2" />
          <FSDImage src="/template/600x400.png" alt="Item 3" />
        </div>
      </Marquee>
    </>
  );
}

export default MarqueeSectionText;