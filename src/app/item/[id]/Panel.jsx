function Panel({ children }) {
  return (
    <div className="bg-blue-200/30 rounded-2xl w-full h-full p-4 overflow-hidden">
      {children}
    </div>
  );
}

export default Panel;
