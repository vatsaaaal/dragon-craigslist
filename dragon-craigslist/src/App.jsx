import { useState } from "react";

function App() {
  const [isAcademic, setIsAcademic] = useState(null);
  const [institutionName, setInstitutionName] = useState(null);

  const checkAcademicEmail = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/check-academic-email?email=qb42@drexel.edu"
      );
      const data = await response.json();

      setIsAcademic(data.isAcademic);
      setInstitutionName(data.institutionName);
      console.log("Is Academic Email:", data.isAcademic);
      console.log("Institution Name:", data.institutionName);
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="App">
      <h1>Dragon-Craigslist Coming Soon</h1>
      <button onClick={checkAcademicEmail}>Check Academic Email</button>
      {isAcademic !== null && (
        <p>
          {isAcademic
            ? `This is an academic email from ${institutionName}.`
            : "This is not an academic email."}
        </p>
      )}
    </div>
  );
}

export default App;
