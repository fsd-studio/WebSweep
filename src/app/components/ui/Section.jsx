function Section({children, outerC, innerC}) {
  return (
    <div className={`${outerC} py-18 px-6 md:px-10 overflow-hidden`}>
      <div className={`${innerC} lg:max-w-[1360px] mx-auto`}>
          {children}
      </div>
    </div>
  );
}

export default Section;