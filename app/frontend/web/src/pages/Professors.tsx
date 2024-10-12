import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";

type Professor = {
  "Primary Instructor": string;
  "Professor Rating": number;
  courses: {
    Subject: string;
    "Course Number": number;
    "Course Title": string;
  }[];
};

const ProfessorsPage: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/professors");
        setProfessors(response.data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, []);

  const filteredProfessors = professors.filter((professor) =>
    professor["Primary Instructor"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingColor = (rating: number) => {
    if (rating < 2.5) {
      return "text-red-500";
    } else if (rating < 3.5) {
      return "text-yellow-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <NavBar />
      <div className="h-4/5 w-full max-w-[1440px] flex flex-col justify-start items-center gap-y-4 mx-auto mt-6">
        <div className="w-full max-w-[980px] px-4">
          <input
            type="text"
            placeholder="Search professor by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full max-w-[980px] flex-auto overflow-y-auto">
  <div className="space-y-6">
    {filteredProfessors.map((professor) => (
      <div key={professor["Primary Instructor"]} className="bg-gray-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{professor["Primary Instructor"]}</h2>
        {professor["Professor Rating"] ? (
          <p className={`text-xl mb-4 ${getRatingColor(professor["Professor Rating"])}`}>
            Professor Rating: {professor["Professor Rating"].toFixed(1)}
          </p>
        ) : (
          <p className="text-xl mb-4 text-gray-400">Professor Rating: N/A</p>
        )}
        <div className="space-y-2">
          {professor.courses.map((course, index) => (
            <div key={index} className="bg-black rounded-lg p-4">
              <p>
                {course.Subject} {course["Course Number"]} - {course["Course Title"]}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default ProfessorsPage;
