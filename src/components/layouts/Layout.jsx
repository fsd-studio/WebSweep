// components/layouts/Layout.jsx
import Footer from "components/sections/footer/Footer";
import Nav from "components/sections/nav/Nav";

export default function Layout({ children, fonts }) {
  return (
    <div className={`${fonts}`}>
      {/* Pass nav translations to the Nav component */}
      <Nav />

      {children}

      <Footer />
    </div>
  );
}