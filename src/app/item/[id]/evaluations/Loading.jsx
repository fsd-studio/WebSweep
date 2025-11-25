function Loading({children}) {
  return (
    <div className="rounded-2xl w-full text-gray-700">
        <div className="w-fit py-5 bg-blue-200 animate-pulse p-4 text-xs rounded-2xl mb-2">
            {children}
        </div>

        <div className="bg-blue-200 w-full h-10 mb-2 rounded-2xl animate-pulse">
        </div>
        <div className="bg-blue-200 w-full h-20 rounded-2xl animate-pulse">
        </div>
    </div>
  );
}

export default Loading;