import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const ProgressDashboard = ({ userId }) => {
  const [progressData, setProgressData] = useState({
    studyHours: [],
    subjectPerformance: {},
    streakDays: 0,
    totalQuestions: 0,
  });

  useEffect(() => {
    const q = query(
      collection(db, "user_progress"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      processProgressData(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const chartData = {
    labels: progressData.studyHours.map((d) => d.date),
    datasets: [
      {
        label: "Study Hours",
        data: progressData.studyHours.map((d) => d.hours),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="progress-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Study Streak</h3>
          <p className="stat-number">{progressData.streakDays} days</p>
        </div>
        <div className="stat-card">
          <h3>Questions Answered</h3>
          <p className="stat-number">{progressData.totalQuestions}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Study Hours This Week</h3>
          <Line data={chartData} />
        </div>

        <div className="chart">
          <h3>Subject Performance</h3>
          <Bar data={subjectPerformanceData} />
        </div>
      </div>
    </div>
  );
};
