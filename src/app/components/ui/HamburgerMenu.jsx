function HamburgerMenu({
    isOpen,
    onClick
}) {
    const barClass = "h-1 w-8 rounded-full transition-all duration-300 ease-in-out" + (isOpen ? " bg-secondary" : " bg-primary");

    return (
        <div className="space-y-1.5" onClick={onClick}>
            <div className={barClass + (isOpen ? " rotate-45 translate-y-2.5" : "")}></div>
            <div className={`${barClass} ${isOpen ? "opacity-0" : ""}`}></div>
            <div className={barClass + (isOpen ? " -rotate-45 -translate-y-2.5" : "")}></div>
        </div>
    );
}

export default HamburgerMenu;