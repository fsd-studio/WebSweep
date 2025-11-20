import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export default function Layout({ children, fonts }) {
  return (
    <div className={`${fonts} h-screen overflow-hidden flex flex-col lg:grid lg:grid-cols-6 px-5 gap-4 py-4`}>
      {/* <Sidebar /> */}
      <div className="p-5 xl:p-6 items-center col-span-1 md:flex justify-between lg:flex-col bg-blue-700 rounded-4xl">
        {/* <Logo /> */}
        <Logo />

        <div className="justify-center flex lg:items-end">
          <ul className="flex gap-3 mt-2 lg:flex-col">
            <SidebarLink href="/" icon={<IoSearch className="w-6 h-6"></IoSearch>} text="Search"></SidebarLink>
            <SidebarLink href="/item/1" icon={<IoSearch className="w-6 h-6"></IoSearch>} text="item with ID 1"></SidebarLink>
            <SidebarLink text="link3" icon={<IoSearch className="w-6 h-6"></IoSearch>}></SidebarLink>
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:col-span-5 p-6 h-full overflow-y-auto border rounded-4xl">
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/">
      <div className="relative">
        <img src="/template/logo1.png" alt="Logo" className="h-14 mx-auto -mb-4 md:h-18 -rotate-14 w-auto" />
        <h2 className="text-lg md:text-xl xl:text-2xl text-center text-white uppercase font-Lato relative z-10 font-extrabold tracking-wide">WebSweep</h2>
      </div>
    </Link>
  );
}

function SidebarLink({ href = "/", text, icon }) {
  return (
    <li>
      <Link
        className="font-geist-mono flex items-center gap-3 px-4 py-3 bg-blue-800/70 text-white font-semibold text-lg rounded-2xl mx-auto"
        href={href}

      >
        {icon}
        <p className="hidden md:block">
          {text}
        </p>
      </Link>
    </li>
  );
}
