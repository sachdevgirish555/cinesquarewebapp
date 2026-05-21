// src/layouts/WebsiteLayout.jsx
import Footer from "../components/Footer";
import FloatingCallButton from "../components/FloatingCallButton";

const WebsiteLayout = ({ children }) => {
  return (
    <>
      {children}
      <FloatingCallButton />
      <Footer />
    </>
  );
};

export default WebsiteLayout;
