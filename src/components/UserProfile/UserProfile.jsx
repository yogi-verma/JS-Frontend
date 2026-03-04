import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext/UserContext";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { FiArrowLeft, FiUser, FiBriefcase, FiShare2, FiShield, FiMail, FiCalendar, FiHash, FiZap } from "react-icons/fi";
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
import Streak from "./Streak/Streak";
import DailyQuiz from "../DailyQuiz/DailyQuiz";

/* ─── Reusable card wrapper ─── */
const ProfileCard = ({ icon, title, iconColor, isDark, children }) => {
  const IconComp = icon;
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: isDark ? "#161B22" : "#FFFFFF",
        border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `${iconColor}18` }}
        >
          <IconComp className="w-3 h-3" style={{ color: iconColor }} />
        </div>
        <h3
          className={`text-xs font-semibold tracking-wide uppercase ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {title}
        </h3>
      </div>
      {/* Card body */}
      <div>{children}</div>
    </div>
  );
};

const UserProfile = () => {
  const { user, showDailyQuiz } = useUser();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [, setForceRender] = useState(0);

  useEffect(() => {
    initEmailJS();
  }, []);

  useEffect(() => {
    setForceRender((v) => v + 1);
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: isDark ? "#0D1117" : "#F6F8FA" }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            className="text-center p-10 rounded-2xl max-w-md w-full"
            style={{
              background: isDark ? "#161B22" : "#FFFFFF",
              border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
              style={{ background: isDark ? "#21262D" : "#F3F4F6" }}
            >
              <FiMail className="w-7 h-7" style={{ color: isDark ? "#8B949E" : "#6B7280" }} />
            </div>
            <h2
              className={`text-xl font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Sign in required
            </h2>
            <p className={`text-xs mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Please log in to view your profile and track your progress.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-2 rounded-lg font-medium text-xs transition-all hover:opacity-90"
              style={{ background: "#238636", color: "#FFFFFF" }}
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

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const userId = user.googleId || user._id || "N/A";
  const accountType = user.googleId ? "Google OAuth" : "Local";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#0D1117" : "#F6F8FA" }}
    >
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isDark
              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
              : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          }`}
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        {/* ============ ROW 1 — Image + Progress ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Profile / Image Card */}
          <div className="lg:col-span-4">
            <div
              className="rounded-xl overflow-hidden h-full"
              style={{
                background: isDark ? "#161B22" : "#FFFFFF",
                border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              }}
            >
              <div className="p-5 flex flex-col items-center text-center">
                <DisplayImage
                  user={user}
                  isDark={isDark}
                  getInitials={getInitials}
                />
                {/* Name & handle */}
                <div className="mt-2 w-full">
                  <h1
                    className={`text-lg font-bold leading-snug ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {user.displayName || "User"}
                  </h1>
                </div>
                {/* Bio */}
                <div className="mt-2 w-full">
                  <DisplayBio user={user} isDark={isDark} />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Analytics Card */}
          <div className="lg:col-span-8">
            <div
              className="rounded-xl overflow-hidden h-full"
              style={{
                background: isDark ? "#161B22" : "#FFFFFF",
                border: `1px solid ${isDark ? "#30363D" : "#D0D7DE"}`,
              }}
            >
              <div className="p-5">
                <ProgressAnalytics isDark={isDark} />
              </div>
            </div>
          </div>
        </div>

        {/* ============ ROW 1.5 — Streak Calendar ============ */}
        <div className="mt-5">
          <ProfileCard
            icon={FiZap}
            title="Activity Streak"
            iconColor="#F59E0B"
            isDark={isDark}
          >
            <div className="p-4">
              <Streak isDark={isDark} />
            </div>
          </ProfileCard>
        </div>

        {/* ============ ROW 2 - Personal + Professional ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          {/* Personal Information Card */}
          <ProfileCard
            icon={FiUser}
            title="Personal Information"
            iconColor="#8B5CF6"
            isDark={isDark}
          >
            <DisplayName user={user} isDark={isDark} />
            <DisplayEmail user={user} isDark={isDark} />
            <div
              className={`px-4 py-3 ${isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"} transition-colors`}
            >
              <label
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Bio
              </label>
              <p
                className={`text-xs mt-0.5 leading-relaxed ${
                  user.bio
                    ? isDark
                      ? "text-gray-300"
                      : "text-gray-700"
                    : isDark
                    ? "text-gray-600 italic"
                    : "text-gray-400 italic"
                }`}
              >
                {user.bio || "No bio added yet"}
              </p>
            </div>
          </ProfileCard>

          {/* Professional Information Card */}
          <ProfileCard
            icon={FiBriefcase}
            title="Professional Information"
            iconColor="#06B6D4"
            isDark={isDark}
          >
            <DisplayTitle user={user} isDark={isDark} />
            <DisplayCompany user={user} isDark={isDark} />
            <DisplayWebsite user={user} isDark={isDark} />
          </ProfileCard>
        </div>

        {/* ============ ROW 3 - Social + Account ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 mb-2">
          {/* Social Media Links Card */}
          <ProfileCard
            icon={FiShare2}
            title="Social Media Links"
            iconColor="#10B981"
            isDark={isDark}
          >
            <DisplaySocialLinks user={user} isDark={isDark} />
          </ProfileCard>

          {/* Account Info Card */}
          <ProfileCard
            icon={FiShield}
            title="Account Information"
            iconColor="#F59E0B"
            isDark={isDark}
          >
            {/* Account Type */}
            <div
              className={`flex items-center justify-between px-4 py-3 transition-colors ${
                isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"
              }`}
              style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
            >
              <div className="flex-1 min-w-0">
                <label
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Account Type
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user.googleId && (
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {accountType}
                  </span>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div
              className={`flex items-center justify-between px-4 py-3 transition-colors ${
                isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"
              }`}
              style={{ borderBottom: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
            >
              <div className="flex-1 min-w-0">
                <label
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  User ID
                </label>
                <p
                  className={`text-xs font-mono mt-0.5 truncate ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                  title={userId}
                >
                  {userId}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div
              className={`flex items-center justify-between px-4 py-3 transition-colors ${
                isDark ? "hover:bg-[#1C2128]" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex-1 min-w-0">
                <label
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Member Since
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <FiCalendar
                    className="w-3 h-3 shrink-0"
                    style={{ color: isDark ? "#8B949E" : "#656D76" }}
                  />
                  <span
                    className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {memberSince || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </ProfileCard>
        </div>
      </main>

      <Footer />

      {/* Daily Quiz popup — rendered here so it works when navigating directly to /profile */}
      {showDailyQuiz && <DailyQuiz />}
    </div>
  );
};

export default UserProfile;
