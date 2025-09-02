// Quick debug test - Let's add some console logs to understand what's happening

console.log("🔍 Debugging localStorage issue...");

// Check if there's data in localStorage
const checkData = () => {
  const keys = Object.keys(localStorage);
  console.log("All localStorage keys:", keys);

  keys.forEach((key) => {
    if (key.includes("study") || key.includes("Plan")) {
      console.log(`${key}:`, localStorage.getItem(key));
    }
  });
};

checkData();

// Test data persistence
const testUserId = "test-user-123";
const testTask = {
  id: Date.now(),
  title: "Debug Task RR",
  subject: "mathematics",
  type: "homework",
  priority: "medium",
  date: new Date().toISOString().split("T")[0],
  time: "09:00",
  duration: "60",
  completed: false,
  createdAt: new Date().toISOString(),
};

console.log("Today's date:", new Date().toISOString().split("T")[0]);
console.log("Test task date:", testTask.date);

// Save test data
localStorage.setItem(`studyPlan_${testUserId}`, JSON.stringify([testTask]));
console.log("Test data saved!");

checkData();

// Try to load it back
const loaded = localStorage.getItem(`studyPlan_${testUserId}`);
console.log("Loaded data:", loaded);
console.log("Parsed data:", JSON.parse(loaded));
