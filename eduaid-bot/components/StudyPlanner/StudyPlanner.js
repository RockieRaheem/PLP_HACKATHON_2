import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { httpsCallable } from "firebase/functions";

const localizer = momentLocalizer(moment);

const StudyPlanner = () => {
  const [subjects, setSubjects] = useState([]);
  const [examDates, setExamDates] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStudyPlan = httpsCallable(functions, "generateStudyPlan");

  const handleGeneratePlan = async () => {
    setIsGenerating(true);

    try {
      const result = await generateStudyPlan({
        subjects: subjects,
        examDates: examDates,
        studyHoursPerDay: 4,
        preferredStudyTimes: ["morning", "evening"],
      });

      setStudyPlan(result.data.plan);
    } catch (error) {
      console.error("Plan generation error:", error);
    }

    setIsGenerating(false);
  };

  return (
    <div className="study-planner">
      <div className="planner-setup">
        <h2>Create Your Study Plan</h2>

        <div className="subjects-input">
          <label>Your Subjects:</label>
          {subjects.map((subject, index) => (
            <input
              key={index}
              value={subject.name}
              onChange={(e) => updateSubject(index, "name", e.target.value)}
              placeholder="Subject name"
            />
          ))}
          <button
            onClick={() =>
              setSubjects([...subjects, { name: "", difficulty: "medium" }])
            }
          >
            Add Subject
          </button>
        </div>

        <div className="exam-dates">
          <label>Exam Dates:</label>
          {examDates.map((exam, index) => (
            <div key={index}>
              <input
                type="text"
                value={exam.subject}
                placeholder="Subject"
                onChange={(e) => updateExam(index, "subject", e.target.value)}
              />
              <input
                type="date"
                value={exam.date}
                onChange={(e) => updateExam(index, "date", e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={() =>
              setExamDates([...examDates, { subject: "", date: "" }])
            }
          >
            Add Exam
          </button>
        </div>

        <button onClick={handleGeneratePlan} disabled={isGenerating}>
          {isGenerating ? "Generating AI Study Plan..." : "Generate Study Plan"}
        </button>
      </div>

      <div className="calendar-view">
        <Calendar
          localizer={localizer}
          events={studyPlan}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};
