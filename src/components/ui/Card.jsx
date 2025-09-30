
function Card({ 
        title = "No Title",
        content = "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
        type = "primary"
    }) {

    const styles = {
        primary: "border-blue-700 bg-blue-100",
        neutral: "border-gray-700 bg-gray-100",
        success: "border-green-700 bg-green-100",
        danger: "border-red-700 bg-red-100",
    }

    const titleStyles = {
        primary: "text-blue-800",
        neutral: "text-gray-800",
        success: "text-green-800",
        danger: "text-red-800",
    }

    return (
        <>
            <div className={`${styles[type]} w-60 p-3 text-center border rounded-2xl space-y-1`}>
                <h2 className={`${titleStyles[type]} text-xl font-primary uppercase font-bold`}>{title}</h2>
                <p className={`text-black`}>{content}</p>    
            </div>
        </>
    );
}

export default Card;