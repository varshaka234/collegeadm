import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  HomeIcon, UsersIcon, ClipboardDocumentListIcon, 
  BellIcon, CogIcon, BookOpenIcon, MegaphoneIcon,
  DocumentTextIcon, ChartBarIcon, UserCircleIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import RankList from "../pages/RankList"; // Adjust path if needed

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [applicants, setApplicants] = useState([]);

 
  useEffect(() => {
    axios.get("/api/admin/applicants")
      .then(res => {
        console.log("API Response:", res.data); // Debugging log
        setApplicants(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error fetching applicants:", err);
        setApplicants([]); // Set an empty array to prevent errors
      });
  }, []);
  useEffect(() => {
    const fetchApplicants = () => {
      axios.get("/api/admin/applicants")
        .then(res => {
          console.log("Updated Applicants List:", res.data);
          setApplicants(Array.isArray(res.data) ? res.data : []);
        })
        .catch(err => {
          console.error("Error fetching applicants:", err);
        });
    };
  
    fetchApplicants(); // Initial fetch
    const interval = setInterval(fetchApplicants, 10000); // Auto-refresh every 10s
  
    return () => clearInterval(interval); // Cleanup
  }, []);
  
  

  const updateStatus = (studentId, status) => {
    axios.put(`/api/admin/update-status/${studentId}`, { status })
      .then(() => {
        setApplicants(applicants.map(applicant =>
          applicant.student_id === studentId ? { ...applicant, app_status: status } : applicant
        ));
      })
      .catch(err => console.error("Error updating status:", err));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5 space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <SidebarItem icon={HomeIcon} label="Dashboard" onClick={() => setActiveTab("dashboard")} />
          <SidebarItem icon={UsersIcon} label="Applicants" onClick={() => setActiveTab("applicants")} />
          <SidebarItem icon={ClipboardDocumentListIcon} label="Exam Management" onClick={() => setActiveTab("exam")} />
          <SidebarItem icon={BellIcon} label="Notifications" onClick={() => setActiveTab("notifications")} />
          <SidebarItem icon={CogIcon} label="Settings" onClick={() => setActiveTab("settings")} />
          <SidebarItem icon={MagnifyingGlassIcon} label="Search Applications" onClick={() => setActiveTab("search")} />
          <SidebarItem icon={BookOpenIcon} label="Courses" onClick={() => setActiveTab("courses")} />
          <SidebarItem icon={MegaphoneIcon} label="Notices" onClick={() => setActiveTab("notices")} />
          <SidebarItem icon={DocumentTextIcon} label="Pages" onClick={() => setActiveTab("pages")} />
          <SidebarItem icon={UsersIcon} label="Subscribers" onClick={() => setActiveTab("subscribers")} />
          <SidebarItem icon={ChartBarIcon} label="Reports" onClick={() => setActiveTab("reports")} />
          <SidebarItem icon={UserCircleIcon} label="Profile" onClick={() => setActiveTab("profile")} />
          <SidebarItem icon={ChartBarIcon} label="Rank List" onClick={() => setActiveTab("rankList")} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "applicants" && <Applicants applicants={applicants} />}
        {activeTab === "exam" && <ExamManagement />}
        {activeTab === "search" && <SearchApplications />}
        {activeTab === "courses" && <CourseManagement />}
        {activeTab === "notices" && <NoticeManagement />}
        {activeTab === "rankList" && <RankList examId={101} />}
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, onClick }) {
  return (
    <div className="flex items-center space-x-2 p-3 cursor-pointer hover:bg-blue-700 rounded" onClick={onClick}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <DashboardCard title="Total Applicants" count={120} />
        <DashboardCard title="Pending Approvals" count={34} />
        <DashboardCard title="Total Courses" count={10} />
      </div>
    </div>
  );
}

function DashboardCard({ title, count }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-blue-900">{count}</p>
    </div>
  );
}

function Applicants({ applicants }) {
  if (!Array.isArray(applicants)) {
    return <p className="text-center text-red-600">Error: Applicants data is invalid.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Applications</h2>
      <table className="w-full mt-4 bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Program</th>
            <th className="p-2">Payment Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length > 0 ? (
            applicants.map((applicant) => (
              <tr key={applicant.student_id} className="border-t">
                <td className="p-2">{applicant.name}</td>
                <td className="p-2">{applicant.program}</td>
                <td className="p-2 text-green-600">{applicant.payment_status}</td>
                <td className="p-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded">
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No applicants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


function ExamManagement() {
  const [examDate, setExamDate] = useState("");
  const [examCenter, setExamCenter] = useState("");

  function handleSetExam() {
    if (!examDate || !examCenter) {
      alert("Please fill all details");
      return;
    }
    console.log("Exam Set:", { examDate, examCenter });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Exam Management</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <label className="block mb-2">Select Date:</label>
        <input 
          type="date" 
          value={examDate} 
          onChange={(e) => setExamDate(e.target.value)} 
          className="p-2 border rounded w-full" 
        />

        <label className="block mt-4 mb-2">Select Center:</label>
        <input 
          type="text" 
          value={examCenter} 
          onChange={(e) => setExamCenter(e.target.value)}
          placeholder="Enter exam center" 
          className="p-2 border rounded w-full" 
        />

        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" 
          onClick={handleSetExam}
        >
          Set Exam
        </button>
      </div>
    </div>
  );
}
