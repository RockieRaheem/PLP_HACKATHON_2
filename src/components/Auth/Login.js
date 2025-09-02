import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./ModernAuth.css";

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
    country: "",
    goals: "",
    preferredLanguage: "",
    academicLevel: "",
  });

  // Google Auth Provider (removed to avoid unused variable)

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
    "WAEC (West African Examinations Council)",
    "KCSE (Kenya Certificate of Secondary Education)",
    "Matric (South African National Senior Certificate)",
    "JAMB (Joint Admissions and Matriculation Board)",
    "UNEB (Uganda National Examinations Board)",
    "NECTA (National Examinations Council of Tanzania)",
    "Baccalauréat (French African System)",
    "Cambridge International (Former British Colonies)",
    "Egyptian Thanaweya Amma",
    "Moroccan Baccalauréat",
    "Ethiopian Higher Education Entrance Examination",
    "Algerian Baccalauréat",
  ];

  // Academic levels across African systems
  const academicLevels = [
    "Primary Education (Ages 6-12)",
    "Junior Secondary (Ages 13-15)",
    "Senior Secondary (Ages 16-18)",
    "Form 1-4 (East African System)",
    "Grade 8-12 (Southern African System)",
    "O-Level (Ordinary Level)",
    "A-Level (Advanced Level)",
    "JAMB Candidate (Nigerian University Entry)",
    "University Undergraduate",
    "University Postgraduate",
    "Professional Development",
    "Adult Education",
  ];

  // Major African languages
  const africanLanguages = [
    "English",
    "French",
    "Arabic",
    "Portuguese",
    "Swahili",
    "Amharic",
    "Yoruba",
    "Igbo",
    "Hausa",
    "Zulu",
    "Xhosa",
    "Afrikaans",
    "Twi",
    "Kinyarwanda",
    "Luganda",
    "Oromo",
    "Berber",
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
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          console.error("Email sign-in error:", error);

          // Handle specific Firebase auth errors
          if (error.code === "auth/invalid-credential") {
            setErrors({
              general:
                "Invalid email or password. Please check your credentials and try again.",
            });
          } else if (error.code === "auth/user-not-found") {
            setErrors({
              general:
                "No account found with this email. Please create a new account or check your email address.",
            });
          } else if (error.code === "auth/wrong-password") {
            setErrors({
              general:
                "Incorrect password. Please check your password and try again.",
            });
          } else if (error.code === "auth/invalid-email") {
            setErrors({
              general:
                "Invalid email format. Please enter a valid email address.",
            });
          } else if (error.code === "auth/too-many-requests") {
            setErrors({
              general:
                "Too many failed attempts. Please try again later or reset your password.",
            });
          } else if (
            error.code === "auth/recaptcha-not-enabled" ||
            (error.message && error.message.includes("_getRecaptchaConfig"))
          ) {
            setErrors({
              general:
                "Authentication is loading. Please wait a moment and try again.",
            });
          } else {
            // For any other error, check if user exists with different sign-in method
            try {
              const signInMethods = await fetchSignInMethodsForEmail(
                auth,
                email
              );

              if (signInMethods.length > 0) {
                if (signInMethods.includes("google.com")) {
                  setErrors({
                    general:
                      "This email is registered with Google sign-in. Please use 'Continue with Google' button.",
                  });
                } else {
                  setErrors({
                    general:
                      "Invalid password. Please check your password and try again.",
                  });
                }
              } else {
                setErrors({
                  general:
                    "No account found with this email. Please create a new account.",
                });
              }
            } catch (fetchError) {
              console.error("Error checking sign-in methods:", fetchError);
              setErrors({
                general:
                  "Sign-in failed. Please check your credentials and try again.",
              });
            }
          }
        }
      } else {
        // Sign up flow
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await setDoc(doc(db, "users", userCredential.user.uid), {
            ...profile,
            email: email,
            provider: "email",
            createdAt: new Date(),
            lastLogin: new Date(),
            preferences: {
              theme: "modern-light",
              timezone: "Africa/Lagos",
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
        } catch (signUpError) {
          console.error("Sign-up error:", signUpError);

          if (signUpError.code === "auth/email-already-in-use") {
            // Check what sign-in methods are available for this email
            try {
              const signInMethods = await fetchSignInMethodsForEmail(
                auth,
                email
              );

              if (signInMethods.includes("google.com")) {
                setErrors({
                  general:
                    "An account with this email already exists with Google sign-in. Please use 'Continue with Google' or try signing in with your password.",
                });
              } else {
                setErrors({
                  general:
                    "An account with this email already exists. Please sign in instead.",
                });
              }
            } catch (fetchError) {
              setErrors({
                general:
                  "An account with this email already exists. Please sign in instead.",
              });
            }
          } else if (signUpError.code === "auth/weak-password") {
            setErrors({
              general:
                "Password is too weak. Please choose a stronger password with at least 6 characters.",
            });
          } else if (signUpError.code === "auth/invalid-email") {
            setErrors({
              general:
                "Invalid email format. Please enter a valid email address.",
            });
          } else {
            setErrors({
              general:
                signUpError.message ||
                "Failed to create account. Please try again.",
            });
          }
        }
      }
    } catch (error) {
      // This catch block handles any other unexpected errors
      console.error("Unexpected auth error:", error);
      if (!errors.general) {
        setErrors({
          general:
            "An unexpected error occurred. Please try again or contact support.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Create a fresh provider instance with explicit configuration
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: "select_account",
        access_type: "offline",
      });

      console.log("Attempting Google sign-in...");
      console.log("Auth domain:", auth.app.options.authDomain);
      console.log("Project ID:", auth.app.options.projectId);

      const result = await signInWithPopup(auth, googleProvider);

      if (!result || !result.user) {
        throw new Error("No user data received from Google");
      }

      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create user document for new Google users
        await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "google",
          createdAt: new Date(),
          lastLogin: new Date(),
          preferences: {
            theme: "modern-light",
            timezone: "Africa/Lagos",
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
      } else {
        // Update last login for existing users
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: new Date(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));

      let errorMessage = "Failed to sign in with Google. Please try again.";

      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage =
          "Pop-up was blocked by your browser. Please enable pop-ups and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/internal-error") {
        errorMessage =
          "Authentication service temporarily unavailable. Please try again.";
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage =
          "This domain is not authorized for Google sign-in. Please use email sign-in instead.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Google sign-in is not enabled. Please use email sign-in instead.";
      } else if (error.message && error.message.includes("create")) {
        errorMessage =
          "Google authentication is not properly configured. Please try email sign-in.";
      }

      setErrors({ google: errorMessage });
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
      country: "",
      goals: "",
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
    <div className="auth-container">
      <div className="auth-card">
        {/* Header Section - Inside the card */}
        <div className="auth-header">
          <div className="flag-decoration">🌍</div>
          <div className="brand-logo">E</div>
          <h1 className="brand-title">EduAid</h1>
          <p className="brand-subtitle">
            🌟 Illuminating African Minds Across the Galaxy 🌟
          </p>
          <p className="brand-motto">
            "Elimu ni Ufunguo" (Education is the Key)
          </p>
        </div>

        {/* Form Container */}
        <div className="auth-form-container">
          {/* Toggle Buttons */}
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${isLogin ? "active" : ""}`}
              onClick={() => isLogin || toggleAuthMode()}
            >
              Sign In
            </button>
            <button
              className={`toggle-btn ${!isLogin ? "active" : ""}`}
              onClick={() => !isLogin || toggleAuthMode()}
            >
              Join Us
            </button>
          </div>

          {/* Progress Steps for Signup */}
          {!isLogin && (
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                <div className="step-number">1</div>
                <div className="step-label">Account</div>
              </div>
              <div className="step-connector"></div>
              <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                <div className="step-number">2</div>
                <div className="step-label">Profile</div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {errors.general && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleAuth}>
            {/* Step 1: Basic Authentication */}
            {(isLogin || currentStep === 1) && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`form-input ${errors.email ? "error" : ""}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="field-error">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-input ${errors.password ? "error" : ""}`}
                      required
                    />
                    <span
                      className="input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </span>
                  </div>
                  {errors.password && (
                    <span className="field-error">{errors.password}</span>
                  )}
                </div>

                {!isLogin && (
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
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
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {/* Step 2: African Profile Setup */}
            {!isLogin && currentStep === 2 && (
              <div className="form-step">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className={`form-input ${errors.name ? "error" : ""}`}
                    required
                  />
                  {errors.name && (
                    <span className="field-error">{errors.name}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <label className="form-label">Country</label>
                    <select
                      value={profile.country}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      className={`form-select ${errors.country ? "error" : ""}`}
                      required
                    >
                      <option value="">Select your country</option>
                      {africaCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <span className="field-error">{errors.country}</span>
                    )}
                  </div>

                  <div className="form-col">
                    <label className="form-label">Academic Level</label>
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
                      <option value="">Select your level</option>
                      {academicLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.academicLevel && (
                      <span className="field-error">
                        {errors.academicLevel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-col">
                    <label className="form-label">
                      Education System (Optional)
                    </label>
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
                      <option value="">Select system</option>
                      {educationSystems.map((system) => (
                        <option key={system} value={system}>
                          {system}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-col">
                    <label className="form-label">Preferred Language</label>
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
                      <option value="">Select language</option>
                      {africanLanguages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      "Create Account"
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
            className="btn btn-google"
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
            <div className="auth-footer">
              <button
                type="button"
                className="link-btn"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
