// components/layouts/Layout.jsx

import Link from "next/link";

export default function Layout({ children, fonts }) {
  return (
    <div className={`${fonts} h-screen overflow-hidden grid lg:grid-cols-6 px-5 gap-4 py-4`}>
      {/* <Sidebar /> */}
      <div className="p-6 col-span-1 flex justify-between flex-col border rounded-4xl">
        {/* <Logo /> */}
        <Logo />

        <div className="items-end">
          <ul className="flex gap-3 flex-col">
            <SidebarLink href="/metrics" text="Metrics API" />
            <SidebarLink href="#" text="Link 2" />
            <SidebarLink href="#" text="Link 3" />
            <SidebarLink href="#" text="Link 4" />
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
      <div className="flex items-center">
        <img src="/template/logo.png" alt="Logo" className="h-10 w-auto" />
        <span className="font-bold ms-3 text-3xl uppercase font-primary">WebSweep</span>
      </div>
    </Link>
  );
}

function SidebarLink({ href, text }) {
  return (
    <li>
      <Link
        className="font-geist-mono px-4 py-2 bg-blue-100 rounded-4xl block text-center"
        href={href}

      >
        {text}
      </Link>
    </li>
  );
}