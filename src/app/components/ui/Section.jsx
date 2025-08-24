function Section({children, className}) {
  return (
    <div className={`${className} py-18 px-6 md:px-10`}>
      <div className={`lg:max-w-[1360px] mx-auto`}>
          {children}
      </div>
    </div>
  );
}

export default Section;