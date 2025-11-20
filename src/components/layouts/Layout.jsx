import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export default function Layout({ children, fonts }) {
  return (
    <div className={`${fonts} h-screen overflow-hidden grid lg:grid-cols-6 px-5 gap-4 py-4`}>
      {/* <Sidebar /> */}
      <div className="p-6 col-span-1 flex justify-between flex-col bg-blue-700 rounded-4xl">
        {/* <Logo /> */}
        <Logo />

        <div className="items-end">
          <ul className="flex gap-3 flex-col">
            <SidebarLink href="/" icon={<IoSearch className="w-6 h-6"></IoSearch>} text="Search"></SidebarLink>
            <SidebarLink href="/item/1" text="item with ID 1"></SidebarLink>
            <SidebarLink text="link3"></SidebarLink>
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
        <p className="text-2xl md:text-2xl text-center text-white uppercase font-Lato relative z-10 font-extrabold tracking-wide">WebSweep</p>
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
        <p>
          {text}
        </p>
      </Link>
    </li>
  );
}
