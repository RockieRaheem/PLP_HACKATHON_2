// components/Auth/Login.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    grade: "",
    subjects: [],
    country: "",
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Save profile to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), profile);
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth}>{/* Auth form UI */}</form>
    </div>
  );
};
