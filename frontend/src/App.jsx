import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

// Website pages
const Homepage = React.lazy(() => import("./page/Homepage"));
const Contact = React.lazy(() => import("./page/Contact"));
const FAQ = React.lazy(() => import("./page/FAQ"));
const Gallery = React.lazy(() => import("./page/Gallery"));
const Blog = React.lazy(() => import("./page/Blog"));
const LegalNotice = React.lazy(() => import("./page/LegalNotice"));
const PrivacyPolicy = React.lazy(() => import("./page/PrivacyPolicy"));
const TermConditions = React.lazy(() => import("./page/TermConditions"));
const ApplyForFranchise = React.lazy(() => import("./page/ApplyForFranchise"));
const AboutUs = React.lazy(() => import("./page/AboutUs"));
const FeedBack = React.lazy(() => import("./page/FeedBack"));
const MinutesFranchies = React.lazy(() => import("./page/MinutesFranchies"));
const Cinema = React.lazy(() => import("./page/Cinema"));
const Movies = React.lazy(() => import("./page/Movies"));
const CinemaImage = React.lazy(() => import("./page/CinemaImage"));
const BlogDetails = React.lazy(() => import("./page/BlogDetails"));
const Career = React.lazy(() => import("./page/Career"));
const Advertise = React.lazy(() => import("./page/Advertise"));
const Investors = React.lazy(() => import("./page/Investors"));

// Dashboard pages
import DashboardLayout from "./layouts/DashboardLayout";
const Dashboard = React.lazy(() => import("./page/Dashboard"));
const AddMovie = React.lazy(() => import("./page/AddMovie"));
const Settings = React.lazy(() => import("./page/Settings"));

// Layouts & other pages
import WebsiteLayout from "./layouts/WebsiteLayout";
const AddBlog = React.lazy(() => import("./page/AddBlog"));
const Enquiry = React.lazy(() => import("./page/Enquiry"));
const VideoPage = React.lazy(() => import("./page/VideoPage"));
const SliderPage = React.lazy(() => import("./page/SliderPage"));
const User = React.lazy(() => import("./page/User"));
const OurTeam = React.lazy(() => import("./page/OurTeam"));
const Login = React.lazy(() => import("./page/Login"));
import ProtectedRoute from "./components/ProtectedRoute";
const AddCinema = React.lazy(() => import("./page/AddCinema"));
const CinemaGallery = React.lazy(() => import("./page/DashboardPages/CinemaGallery"));
const NotFound = React.lazy(() => import("./page/NotFound"));

const App = () => {
  return (
    <Router>
      <ScrollToTop />

      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-primary text-textColor text-2xl font-bold">Loading...</div>}>
        <Routes>
        {/* 🌐 WEBSITE ROUTES */}
        <Route
          path="/"
          element={
            <WebsiteLayout>
              <Homepage />
            </WebsiteLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <WebsiteLayout>
              <Contact />
            </WebsiteLayout>
          }
        />
        <Route
          path="/about"
          element={
            <WebsiteLayout>
              <AboutUs />
            </WebsiteLayout>
          }
        />
        <Route
          path="/our-team"
          element={
            <WebsiteLayout>
              <OurTeam />
            </WebsiteLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <WebsiteLayout>
              <Gallery />
            </WebsiteLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <WebsiteLayout>
              <FAQ />
            </WebsiteLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <WebsiteLayout>
              <Blog />
            </WebsiteLayout>
          }
        />
        <Route
          path="/login"
          element={
            <WebsiteLayout>
              <Login />
            </WebsiteLayout>
          }
        />
        <Route
          path="/blog-details/:id"
          element={
            <WebsiteLayout>
              <BlogDetails />
            </WebsiteLayout>
          }
        />
        <Route
          path="/career"
          element={
            <WebsiteLayout>
              <Career />
            </WebsiteLayout>
          }
        />
        <Route
          path="/advertise"
          element={
            <WebsiteLayout>
              <Advertise />
            </WebsiteLayout>
          }
        />
        <Route
          path="/investors"
          element={
            <WebsiteLayout>
              <Investors />
            </WebsiteLayout>
          }
        />
        <Route
          path="/cinema"
          element={
            <WebsiteLayout>
              <Cinema />
            </WebsiteLayout>
          }
        />
        <Route
          path="/movie"
          element={
            <WebsiteLayout>
              <Movies />
            </WebsiteLayout>
          }
        />
        <Route
          path="/cinema-image/:id"
          element={
            <WebsiteLayout>
              <CinemaImage />
            </WebsiteLayout>
          }
        />
        <Route
          path="/apply-for-franchise"
          element={
            <WebsiteLayout>
              <ApplyForFranchise />
            </WebsiteLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <WebsiteLayout>
              <FeedBack />
            </WebsiteLayout>
          }
        />
        <Route
          path="/20-minutes-franchise"
          element={
            <WebsiteLayout>
              <MinutesFranchies />
            </WebsiteLayout>
          }
        />
        <Route
          path="/legal-notice"
          element={
            <WebsiteLayout>
              <LegalNotice />
            </WebsiteLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <WebsiteLayout>
              <PrivacyPolicy />
            </WebsiteLayout>
          }
        />
        <Route
          path="/term-conditions"
          element={
            <WebsiteLayout>
              <TermConditions />
            </WebsiteLayout>
          }
        />

        {/* 🧠 DASHBOARD ROUTES (NO FOOTER) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/blog"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddBlog />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cinema"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddCinema />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cinema-gallery"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CinemaGallery />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/movie"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddMovie />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/video"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VideoPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/slider"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SliderPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <User />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/enquiry"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Enquiry />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 🚫 404 – CATCH-ALL */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;
