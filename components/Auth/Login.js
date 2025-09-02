import React, { useState, useEffect } from "react";
import { auth, firestore } from "../../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./GalacticalAuth.css";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [animationClass, setAnimationClass] = useState("");
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

  useEffect(() => {
    setAnimationClass("galactic-slide-in");
    setTimeout(() => setAnimationClass(""), 1000);
  }, [isLogin]);

  // Enhanced African countries with flags and regional grouping
  const africaCountries = [
    "🇳🇬 Nigeria",
    "🇰🇪 Kenya",
    "🇿🇦 South Africa",
    "🇬🇭 Ghana",
    "🇺🇬 Uganda",
    "🇹🇿 Tanzania",
    "🇪🇹 Ethiopia",
    "🇪🇬 Egypt",
    "🇲🇦 Morocco",
    "🇩🇿 Algeria",
    "🇷🇼 Rwanda",
    "🇧🇼 Botswana",
    "🇿🇲 Zambia",
    "🇿🇼 Zimbabwe",
    "🇨🇲 Cameroon",
    "🇨🇮 Ivory Coast",
    "🇸🇳 Senegal",
    "🇲🇱 Mali",
    "🇧🇫 Burkina Faso",
    "🇹🇳 Tunisia",
    "🇱🇾 Libya",
    "🇸🇩 Sudan",
    "🇦🇴 Angola",
    "🇲🇿 Mozambique",
    "🇲🇬 Madagascar",
    "🇲🇼 Malawi",
    "🇳🇦 Namibia",
    "🇸🇿 Eswatini",
    "🇱🇸 Lesotho",
    "🌍 Other African Country",
  ];

  // African Education Systems
  const africaEducationSystems = [
    "🎓 WAEC (West African Examinations Council)",
    "📚 KCSE (Kenya Certificate of Secondary Education)",
    "🏆 Matric (South African National Senior Certificate)",
    "📖 IGCSE (International General Certificate)",
    "🌟 A-Levels (Advanced Level)",
    "🎯 IB (International Baccalaureate)",
    "📝 JAMB (Joint Admissions and Matriculation Board)",
    "🔬 Cambridge International",
    "📊 Edexcel International",
    "🌍 Other African System",
  ];

  // African Academic Levels
  const academicLevels = [
    "🏫 Primary School (Class 1-8)",
    "🎒 Junior Secondary (JSS 1-3 / Form 1-3)",
    "📚 Senior Secondary (SSS 1-3 / Form 4-6)",
    "🎓 University Undergraduate",
    "🔬 University Postgraduate",
    "💼 Professional Development",
    "👨‍🏫 Adult Education",
  ];

  // Enhanced study goals for African context
  const studyGoals = [
    "🎯 Excel in WAEC/KCSE/Matric exams",
    "🏫 Gain admission to top African universities",
    "📈 Improve grades across all subjects",
    "🌟 Master STEM subjects for tech careers",
    "💼 Prepare for professional certifications",
    "🧠 Develop critical thinking skills",
    "🌍 Prepare for international scholarships",
    "💡 Learn coding and digital skills",
    "🔬 Excel in sciences for medical school",
    "📖 Master African languages and heritage",
    "🎨 Develop creative and artistic skills",
    "🏛️ Study African history and governance",
  ];

  // African languages
  const africanLanguages = [
    "🇬🇧 English",
    "🇫🇷 French",
    "🇵🇹 Portuguese",
    "🇪🇸 Spanish",
    "🌍 Swahili",
    "🌍 Amharic",
    "🌍 Yoruba",
    "🌍 Igbo",
    "🌍 Hausa",
    "🌍 Zulu",
    "🌍 Xhosa",
    "🌍 Afrikaans",
    "🌍 Arabic",
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
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
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
        doc(firestore, "users", result.user.uid),
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

      <div className={`auth-cosmic-container ${animationClass}`}>
        {/* African Heritage Panel */}
        <div className="african-heritage-panel">
          <div className="heritage-content">
            {/* Logo with African elements */}
            <div className="african-logo-section">
              <div className="logo-cosmic-container">
                <div className="african-symbol-bg">
                  <div className="adinkra-symbol">🌍</div>
                  <div className="cosmic-rings">
                    <div className="ring ring-gold"></div>
                    <div className="ring ring-green"></div>
                    <div className="ring ring-red"></div>
                  </div>
                </div>
                <div className="shooting-stars">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`shooting-star star-${i + 1}`}
                    ></div>
                  ))}
                </div>
              </div>
              <h1 className="brand-name-cosmic">EduAid</h1>
              <p className="cosmic-slogan">
                🌟 Illuminating African Minds Across the Galaxy 🌟
              </p>
              <div className="african-motto">
                <span className="swahili">"Elimu ni Ufunguo"</span>
                <span className="translation">(Education is the Key)</span>
              </div>
            </div>

            {/* African Excellence Features */}
            <div className="african-features">
              <div className="feature-cosmic">
                <div className="feature-icon-cosmic">🤖</div>
                <div className="feature-content">
                  <h3>AI Ubuntu Assistant</h3>
                  <p>
                    Culturally-aware AI tutor understanding African contexts and
                    learning styles
                  </p>
                </div>
                <div className="feature-glow"></div>
              </div>

              <div className="feature-cosmic">
                <div className="feature-icon-cosmic">📚</div>
                <div className="feature-content">
                  <h3>Pan-African Curriculum</h3>
                  <p>
                    WAEC, KCSE, Matric, JAMB, and all major African education
                    systems
                  </p>
                </div>
                <div className="feature-glow"></div>
              </div>

              <div className="feature-cosmic">
                <div className="feature-icon-cosmic">🌍</div>
                <div className="feature-content">
                  <h3>Local Excellence</h3>
                  <p>
                    Examples from Kilimanjaro to Table Mountain, Lagos to Cairo
                  </p>
                </div>
                <div className="feature-glow"></div>
              </div>

              <div className="feature-cosmic">
                <div className="feature-icon-cosmic">🏛️</div>
                <div className="feature-content">
                  <h3>Heritage Integration</h3>
                  <p>
                    Learn with pride in African achievements, languages, and
                    wisdom
                  </p>
                </div>
                <div className="feature-glow"></div>
              </div>
            </div>

            {/* African Success Statistics */}
            <div className="cosmic-stats">
              <div className="stat-cosmic">
                <div className="stat-number">54+</div>
                <div className="stat-label">African Countries</div>
                <div className="stat-icon">🌍</div>
              </div>
              <div className="stat-cosmic">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Students Empowered</div>
                <div className="stat-icon">🎓</div>
              </div>
              <div className="stat-cosmic">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
                <div className="stat-icon">⭐</div>
              </div>
              <div className="stat-cosmic">
                <div className="stat-number">20+</div>
                <div className="stat-label">Local Languages</div>
                <div className="stat-icon">🗣️</div>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Forms Panel */}
        <div className="auth-cosmic-panel">
          <div className="cosmic-form-container">
            {/* Header with African elements */}
            <div className="cosmic-header">
              <div className="auth-cosmic-toggle">
                <button
                  className={`cosmic-toggle-btn ${isLogin ? "active" : ""}`}
                  onClick={() => isLogin || toggleAuthMode()}
                >
                  <span className="btn-text">Sign In</span>
                  <div className="btn-aurora"></div>
                </button>
                <button
                  className={`cosmic-toggle-btn ${!isLogin ? "active" : ""}`}
                  onClick={() => !isLogin || toggleAuthMode()}
                >
                  <span className="btn-text">Join Us</span>
                  <div className="btn-aurora"></div>
                </button>
                <div
                  className={`cosmic-indicator ${isLogin ? "left" : "right"}`}
                ></div>
              </div>

              <h2 className="cosmic-title">
                {isLogin ? "🌟 Welcome Back, Star!" : "🚀 Begin Your Journey"}
              </h2>
              <p className="cosmic-subtitle">
                {isLogin
                  ? "Continue your educational odyssey across the African cosmos"
                  : "Join the constellation of brilliant African minds reaching for the stars"}
              </p>
            </div>

            {/* Progress Constellation for Signup */}
            {!isLogin && (
              <div className="cosmic-progress">
                <div className="progress-constellation">
                  <div
                    className={`cosmic-step ${
                      currentStep >= 1 ? "active" : ""
                    }`}
                  >
                    <span className="step-star">⭐</span>
                    <span className="step-label">Account</span>
                    <div className="step-glow"></div>
                  </div>
                  <div className="constellation-line"></div>
                  <div
                    className={`cosmic-step ${
                      currentStep >= 2 ? "active" : ""
                    }`}
                  >
                    <span className="step-star">🌟</span>
                    <span className="step-label">Profile</span>
                    <div className="step-glow"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {errors.general && (
              <div className="cosmic-error">
                <span className="error-star">⚠️</span>
                <span className="error-text">{errors.general}</span>
                <div className="error-glow"></div>
              </div>
            )}

            <form onSubmit={handleAuth} className="cosmic-form">
              {/* Step 1: Basic Authentication */}
              {(isLogin || currentStep === 1) && (
                <div className="cosmic-step-container step-1">
                  <div className="cosmic-input-group">
                    <div className="cosmic-input-wrapper">
                      <input
                        type="email"
                        placeholder="Enter your cosmic email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`cosmic-input ${
                          errors.email ? "error" : ""
                        }`}
                        required
                      />
                      <div className="input-cosmic-icon">📧</div>
                      <div className="cosmic-field-glow"></div>
                      <div className="input-aurora"></div>
                    </div>
                    {errors.email && (
                      <span className="cosmic-field-error">{errors.email}</span>
                    )}
                  </div>

                  <div className="cosmic-input-group">
                    <div className="cosmic-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your stellar password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`cosmic-input ${
                          errors.password ? "error" : ""
                        }`}
                        required
                      />
                      <div className="input-cosmic-icon">🔐</div>
                      <button
                        type="button"
                        className="cosmic-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                      <div className="cosmic-field-glow"></div>
                      <div className="input-aurora"></div>
                    </div>
                    {errors.password && (
                      <span className="cosmic-field-error">
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your stellar password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`cosmic-input ${
                            errors.confirmPassword ? "error" : ""
                          }`}
                          required
                        />
                        <div className="input-cosmic-icon">🔒</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                      {errors.confirmPassword && (
                        <span className="cosmic-field-error">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  )}

                  {isLogin ? (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="cosmic-primary-btn"
                    >
                      {isLoading ? (
                        <div className="cosmic-loading">
                          <div className="cosmic-spinner"></div>
                          <span>Launching...</span>
                        </div>
                      ) : (
                        <>
                          <span>🚀 Launch Into Learning</span>
                          <div className="btn-cosmic-effect"></div>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="cosmic-primary-btn"
                    >
                      <span>🌟 Continue Journey</span>
                      <div className="btn-cosmic-effect"></div>
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: African Profile Setup */}
              {!isLogin && currentStep === 2 && (
                <div className="cosmic-step-container step-2">
                  <div className="cosmic-step-header">
                    <h3>🌍 Complete Your African Profile</h3>
                    <p>
                      Help us tailor your learning journey to your African
                      heritage and goals
                    </p>
                  </div>

                  <div className="cosmic-input-row">
                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
                          className={`cosmic-input ${
                            errors.name ? "error" : ""
                          }`}
                          required
                        />
                        <div className="input-cosmic-icon">👤</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                      {errors.name && (
                        <span className="cosmic-field-error">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <select
                          value={profile.country}
                          onChange={(e) =>
                            setProfile({ ...profile, country: e.target.value })
                          }
                          className={`cosmic-select ${
                            errors.country ? "error" : ""
                          }`}
                          required
                        >
                          <option value="">
                            🌍 Select your African country
                          </option>
                          {africaCountries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        <div className="input-cosmic-icon">🌍</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                      {errors.country && (
                        <span className="cosmic-field-error">
                          {errors.country}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cosmic-input-row">
                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <select
                          value={profile.academicLevel}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              academicLevel: e.target.value,
                            })
                          }
                          className={`cosmic-select ${
                            errors.academicLevel ? "error" : ""
                          }`}
                          required
                        >
                          <option value="">
                            🎓 Select your academic level
                          </option>
                          {academicLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                        <div className="input-cosmic-icon">🎓</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                      {errors.academicLevel && (
                        <span className="cosmic-field-error">
                          {errors.academicLevel}
                        </span>
                      )}
                    </div>

                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <select
                          value={profile.educationSystem}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              educationSystem: e.target.value,
                            })
                          }
                          className="cosmic-select"
                        >
                          <option value="">
                            📚 Select your education system
                          </option>
                          {africaEducationSystems.map((system) => (
                            <option key={system} value={system}>
                              {system}
                            </option>
                          ))}
                        </select>
                        <div className="input-cosmic-icon">📚</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                    </div>
                  </div>

                  <div className="cosmic-input-row">
                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <select
                          value={profile.goals}
                          onChange={(e) =>
                            setProfile({ ...profile, goals: e.target.value })
                          }
                          className="cosmic-select"
                        >
                          <option value="">🎯 Select your primary goal</option>
                          {studyGoals.map((goal) => (
                            <option key={goal} value={goal}>
                              {goal}
                            </option>
                          ))}
                        </select>
                        <div className="input-cosmic-icon">🎯</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                    </div>

                    <div className="cosmic-input-group">
                      <div className="cosmic-input-wrapper">
                        <select
                          value={profile.preferredLanguage}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              preferredLanguage: e.target.value,
                            })
                          }
                          className="cosmic-select"
                        >
                          <option value="">
                            🗣️ Preferred learning language
                          </option>
                          {africanLanguages.map((language) => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                        <div className="input-cosmic-icon">🗣️</div>
                        <div className="cosmic-field-glow"></div>
                        <div className="input-aurora"></div>
                      </div>
                    </div>
                  </div>

                  <div className="cosmic-form-actions">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="cosmic-secondary-btn"
                    >
                      <span>← Back to Stars</span>
                      <div className="btn-cosmic-effect"></div>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="cosmic-primary-btn"
                    >
                      {isLoading ? (
                        <div className="cosmic-loading">
                          <div className="cosmic-spinner"></div>
                          <span>Creating Universe...</span>
                        </div>
                      ) : (
                        <>
                          <span>🌟 Join the Constellation</span>
                          <div className="btn-cosmic-effect"></div>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Google Sign In with Enhanced Design */}
            {(isLogin || currentStep === 1) && (
              <>
                <div className="cosmic-divider">
                  <span>or continue with your cosmic identity</span>
                  <div className="divider-stars">
                    <span>⭐</span>
                    <span>🌟</span>
                    <span>✨</span>
                  </div>
                </div>

                <div className="cosmic-social-login">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="cosmic-google-btn"
                  >
                    <div className="google-logo-container">
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="google-logo"
                      >
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <span>Continue with Google</span>
                    <div className="btn-cosmic-effect"></div>
                  </button>
                </div>

                {isLogin && (
                  <div className="cosmic-forgot-password">
                    <button
                      type="button"
                      className="cosmic-link"
                      onClick={handleForgotPassword}
                    >
                      🔮 Forgot your cosmic password?
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
