function Panel({ children }) {
  return (
    <div className="bg-white/90 border border-gray-100 rounded-3xl w-full h-full p-5 shadow-lg">
      {children}
    </div>
  );
}

export default Panel;
