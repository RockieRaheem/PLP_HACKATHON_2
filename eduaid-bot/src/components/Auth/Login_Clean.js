import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./GalacticalAuth.css";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState({
    name: "",
    educationSystem: "",
    subjects: [],
    country: "",
    goals: "",
    studyHours: "",
    preferredLanguage: "",
    academicLevel: "",
  });

  // African countries with flags
  const africaCountries = [
    "🇩🇿 Algeria",
    "🇦🇴 Angola",
    "🇧🇯 Benin",
    "🇧🇼 Botswana",
    "🇧🇫 Burkina Faso",
    "🇧🇮 Burundi",
    "🇨🇲 Cameroon",
    "🇨🇻 Cape Verde",
    "🇨🇫 Central African Republic",
    "🇹🇩 Chad",
    "🇰🇲 Comoros",
    "🇨🇩 Democratic Republic of Congo",
    "🇨🇬 Republic of Congo",
    "🇨🇮 Côte d'Ivoire",
    "🇩🇯 Djibouti",
    "🇪🇬 Egypt",
    "🇬🇶 Equatorial Guinea",
    "🇪🇷 Eritrea",
    "🇪🇹 Ethiopia",
    "🇬🇦 Gabon",
    "🇬🇲 Gambia",
    "🇬🇭 Ghana",
    "🇬🇳 Guinea",
    "🇬🇼 Guinea-Bissau",
    "🇰🇪 Kenya",
    "🇱🇸 Lesotho",
    "🇱🇷 Liberia",
    "🇱🇾 Libya",
    "🇲🇬 Madagascar",
    "🇲🇼 Malawi",
    "🇲🇱 Mali",
    "🇲🇷 Mauritania",
    "🇲🇺 Mauritius",
    "🇲🇦 Morocco",
    "🇲🇿 Mozambique",
    "🇳🇦 Namibia",
    "🇳🇪 Niger",
    "🇳🇬 Nigeria",
    "🇷🇼 Rwanda",
    "🇸🇹 São Tomé and Príncipe",
    "🇸🇳 Senegal",
    "🇸🇨 Seychelles",
    "🇸🇱 Sierra Leone",
    "🇸🇴 Somalia",
    "🇿🇦 South Africa",
    "🇸🇸 South Sudan",
    "🇸🇩 Sudan",
    "🇸🇿 Eswatini",
    "🇹🇿 Tanzania",
    "🇹🇬 Togo",
    "🇹🇳 Tunisia",
    "🇺🇬 Uganda",
    "🇿🇲 Zambia",
    "🇿🇼 Zimbabwe",
  ];

  // African education systems
  const educationSystems = [
    "🎓 WAEC (West African Examinations Council)",
    "🎓 KCSE (Kenya Certificate of Secondary Education)",
    "🎓 Matric (South African National Senior Certificate)",
    "🎓 JAMB (Joint Admissions and Matriculation Board)",
    "🎓 UNEB (Uganda National Examinations Board)",
    "🎓 NECTA (National Examinations Council of Tanzania)",
    "🎓 Baccalauréat (French African System)",
    "🎓 Cambridge International (Former British Colonies)",
    "🎓 Egyptian Thanaweya Amma",
    "🎓 Moroccan Baccalauréat",
    "🎓 Ethiopian Higher Education Entrance Examination",
    "🎓 Algerian Baccalauréat",
  ];

  // Academic levels across African systems
  const academicLevels = [
    "🎓 Primary Education (Ages 6-12)",
    "🎓 Junior Secondary (Ages 13-15)",
    "🎓 Senior Secondary (Ages 16-18)",
    "🎓 Form 1-4 (East African System)",
    "🎓 Grade 8-12 (Southern African System)",
    "🎓 O-Level (Ordinary Level)",
    "🎓 A-Level (Advanced Level)",
    "🎓 JAMB Candidate (Nigerian University Entry)",
    "🎓 University Undergraduate",
    "🎓 University Postgraduate",
    "🎓 Professional Development",
    "🎓 Adult Education",
  ];

  // Major African languages
  const africanLanguages = [
    "🌍 English",
    "🌍 French",
    "🌍 Arabic",
    "🌍 Portuguese",
    "🌍 Swahili",
    "🌍 Amharic",
    "🌍 Yoruba",
    "🌍 Igbo",
    "🌍 Hausa",
    "🌍 Zulu",
    "🌍 Xhosa",
    "🌍 Afrikaans",
    "🌍 Twi",
    "🌍 Kinyarwanda",
    "🌍 Luganda",
    "🌍 Oromo",
    "🌍 Berber",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!isLogin && currentStep === 2) {
      if (!profile.name) newErrors.name = "Name is required";
      if (!profile.country) newErrors.country = "Please select your country";
      if (!profile.academicLevel)
        newErrors.academicLevel = "Please select your academic level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Save comprehensive African-focused profile
        await setDoc(doc(db, "users", userCredential.user.uid), {
          ...profile,
          email: email,
          createdAt: new Date(),
          lastLogin: new Date(),
          preferences: {
            theme: "galactic-african",
            timezone: "Africa/Lagos", // Default to West Africa Time
            notifications: true,
            culturalContext: "african",
            studyReminders: true,
          },
          academicProfile: {
            strengths: [],
            weaknesses: [],
            favoriteSubjects: [],
            studySchedule: {},
            achievements: [],
          },
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: "google",
          createdAt: new Date(),
          lastLogin: new Date(),
          preferences: {
            theme: "galactic-african",
            culturalContext: "african",
          },
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Google auth error:", error);
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setCurrentStep(1);
    setErrors({});
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setProfile({
      name: "",
      educationSystem: "",
      subjects: [],
      country: "",
      goals: "",
      studyHours: "",
      preferredLanguage: "",
      academicLevel: "",
    });
  };

  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const handleForgotPassword = () => {
    console.log("Password reset functionality to be implemented");
  };

  return (
    <div className="galactic-african-container">
      {/* Galactic African Background */}
      <div className="galactic-background">
        {/* Stars and constellations */}
        <div className="star-field">
          {[...Array(200)].map((_, i) => (
            <div
              key={i}
              className={`star star-${(i % 5) + 1}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* African constellation patterns */}
        <div className="african-constellations">
          <div className="constellation baobab-tree"></div>
          <div className="constellation acacia-tree"></div>
          <div className="constellation african-mask"></div>
          <div className="constellation kilimanjaro"></div>
        </div>

        {/* Nebula clouds with African colors */}
        <div className="nebula-clouds">
          <div className="nebula green"></div>
          <div className="nebula gold"></div>
          <div className="nebula red"></div>
        </div>

        {/* Cosmic dust */}
        <div className="cosmic-dust">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="dust-particle" />
          ))}
        </div>
      </div>

      {/* Mobile First Main Container */}
      <div className="mobile-first-container">
        {/* Header Section - Always visible */}
        <div className="header-section">
          <h1 className="brand-title">EduAid</h1>
          <p className="brand-subtitle">
            🌟 Illuminating African Minds Across the Galaxy 🌟
          </p>
          <div className="motto-section">
            <p className="swahili-motto">"Elimu ni Ufunguo"</p>
            <p className="motto-translation">(Education is the Key)</p>
          </div>
        </div>

        {/* Authentication Forms Container */}
        <div className="auth-forms-container">
          <div className="cosmic-form-wrapper">
            {/* Toggle Buttons */}
            <div className="auth-toggle-section">
              <button
                className={`toggle-btn ${isLogin ? "active" : ""}`}
                onClick={() => isLogin || toggleAuthMode()}
              >
                <span>Sign In</span>
              </button>
              <button
                className={`toggle-btn ${!isLogin ? "active" : ""}`}
                onClick={() => !isLogin || toggleAuthMode()}
              >
                <span>Join Us</span>
              </button>
            </div>

            {/* Form Title */}
            <div className="form-title-section">
              <h2 className="form-title">
                {isLogin ? "🌟 Welcome Back!" : "🚀 Begin Your Journey"}
              </h2>
              <p className="form-subtitle">
                {isLogin
                  ? "Continue your educational odyssey"
                  : "Join the constellation of brilliant African minds"}
              </p>
            </div>

            {/* Progress Steps for Signup */}
            {!isLogin && (
              <div className="progress-steps">
                <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Account</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Profile</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Form Content */}
            <form onSubmit={handleAuth} className="auth-form">
              {/* Step 1: Basic Authentication */}
              {(isLogin || currentStep === 1) && (
                <div className="form-step">
                  <div className="input-group">
                    <div className="input-wrapper">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`form-input ${errors.email ? "error" : ""}`}
                        required
                      />
                      <span className="input-icon">📧</span>
                    </div>
                    {errors.email && (
                      <span className="field-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`form-input ${
                          errors.password ? "error" : ""
                        }`}
                        required
                      />
                      <span className="input-icon">🔐</span>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="field-error">{errors.password}</span>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="input-group">
                      <div className="input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`form-input ${
                            errors.confirmPassword ? "error" : ""
                          }`}
                          required
                        />
                        <span className="input-icon">🔒</span>
                      </div>
                      {errors.confirmPassword && (
                        <span className="field-error">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  )}

                  {isLogin ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="primary-btn"
                    >
                      {isLoading ? (
                        <div className="loading-content">
                          <div className="spinner"></div>
                          <span>Launching...</span>
                        </div>
                      ) : (
                        "🚀 Launch Into Learning"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="primary-btn"
                    >
                      🌟 Continue Journey
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: African Profile Setup */}
              {!isLogin && currentStep === 2 && (
                <div className="form-step">
                  <div className="step-header">
                    <h3>🌍 Complete Your African Profile</h3>
                    <p>
                      Help us tailor your learning journey to your African
                      heritage
                    </p>
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className={`form-input ${errors.name ? "error" : ""}`}
                        required
                      />
                      <span className="input-icon">👤</span>
                    </div>
                    {errors.name && (
                      <span className="field-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <select
                        value={profile.country}
                        onChange={(e) =>
                          setProfile({ ...profile, country: e.target.value })
                        }
                        className={`form-select ${
                          errors.country ? "error" : ""
                        }`}
                        required
                      >
                        <option value="">🌍 Select your African country</option>
                        {africaCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <span className="input-icon">🌍</span>
                    </div>
                    {errors.country && (
                      <span className="field-error">{errors.country}</span>
                    )}
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <select
                        value={profile.academicLevel}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            academicLevel: e.target.value,
                          })
                        }
                        className={`form-select ${
                          errors.academicLevel ? "error" : ""
                        }`}
                        required
                      >
                        <option value="">🎓 Select your academic level</option>
                        {academicLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <span className="input-icon">🎓</span>
                    </div>
                    {errors.academicLevel && (
                      <span className="field-error">
                        {errors.academicLevel}
                      </span>
                    )}
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <select
                        value={profile.educationSystem}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            educationSystem: e.target.value,
                          })
                        }
                        className="form-select"
                      >
                        <option value="">
                          📚 Select education system (optional)
                        </option>
                        {educationSystems.map((system) => (
                          <option key={system} value={system}>
                            {system}
                          </option>
                        ))}
                      </select>
                      <span className="input-icon">📚</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <div className="input-wrapper">
                      <select
                        value={profile.preferredLanguage}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            preferredLanguage: e.target.value,
                          })
                        }
                        className="form-select"
                      >
                        <option value="">
                          🗣️ Preferred language (optional)
                        </option>
                        {africanLanguages.map((language) => (
                          <option key={language} value={language}>
                            {language}
                          </option>
                        ))}
                      </select>
                      <span className="input-icon">🗣️</span>
                    </div>
                  </div>

                  <div className="form-buttons">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="secondary-btn"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="primary-btn"
                    >
                      {isLoading ? (
                        <div className="loading-content">
                          <div className="spinner"></div>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "🚀 Complete Registration"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Google Sign In */}
            <div className="divider">
              <span>OR</span>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="google-btn"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="google-logo"
              />
              <span>Continue with Google</span>
            </button>

            {/* Footer Links */}
            {isLogin && (
              <div className="form-footer">
                <button
                  type="button"
                  className="link-btn"
                  onClick={handleForgotPassword}
                >
                  🔮 Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
