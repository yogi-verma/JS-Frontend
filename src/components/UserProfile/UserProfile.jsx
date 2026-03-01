import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext/UserContext";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import colors from "../../utils/color";
import { FiArrowLeft } from "react-icons/fi";
import { initEmailJS } from "../../utils/emailService";
import DisplayName from "./DisplayName/DisplayName";
import DisplayEmail from "./DisplayEmail/DisplayEmail";
import DisplayBio from "./DisplayBio/DisplayBio";
import DisplayImage from "./DisplayImage/DisplayImage";
import DisplayTitle from "./DisplayTitle/DisplayTitle";
import DisplayCompany from "./DisplayCompany/DisplayCompany";
import DisplayWebsite from "./DisplayWebsite/DisplayWebsite";
import DisplaySocialLinks from "./DisplaySocialLinks/DisplaySocialLinks";
import DisplayAccountInformation from "./DisplayAccountInformation/DisplayAccountInformation";
import ProgressAnalytics from "./ProgressAnalytics/ProgressAnalytics";

const UserProfile = () => {
  const { user } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: isDark ? "#111827" : "#F9FAFB" }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2
              className={`text-2xl font-bold mb-4 ${isDark ? "text-gray-100" : "text-gray-800"}`}
            >
              Please log in to view your profile
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg font-medium transition hover:opacity-90"
              style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.textLight,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getInitials = (displayName) => {
    if (!displayName) return "?";
    const names = displayName.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#111827" : "#F9FAFB" }}
    >
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-lg transition hover:opacity-80 text-sm ${
            isDark
              ? "text-gray-300 hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Profile Header */}
        <div
          className="rounded-xl p-5 shadow-md mb-4"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DisplayImage
              user={user}
              isDark={isDark}
              getInitials={getInitials}
            />

            <div className="text-center sm:text-left flex-1">
              <h1
                className={`text-xl font-bold mb-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {user.displayName || "User"}
              </h1>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Analytics Section */}
        <ProgressAnalytics isDark={isDark} />

        {/* Personal Information Section */}
        <div className="mb-4">
          <h2
            className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DisplayName user={user} isDark={isDark} />
            <DisplayEmail user={user} isDark={isDark} />
          </div>
          <div className="mt-3">
            <DisplayBio user={user} isDark={isDark} />
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="mb-4">
          <h2
            className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DisplayTitle user={user} isDark={isDark} />
            <DisplayCompany user={user} isDark={isDark} />
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mb-4">
          <h2
            className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
          >
            Online Presence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <DisplayWebsite user={user} isDark={isDark} />
            <DisplaySocialLinks user={user} isDark={isDark} />
          </div>
        </div>

        {/* Account Info */}
        <DisplayAccountInformation
          user={user}
          isDark={isDark}
          onDelete={() => console.log('Delete account clicked')}
        />
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
