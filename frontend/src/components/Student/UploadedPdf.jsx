import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { FaEye } from "react-icons/fa";
import { MdPictureAsPdf } from "react-icons/md";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center mt-10">
    <div className="animate-spin border-t-4 border-gray-500 border-solid w-12 h-12 rounded-full"></div>
  </div>
);

function UploadedPdf() {
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/student/courses/${courseCode}/uploadedpdf`,
            { withCredentials: true }
          );
          setUploadedPdfs(response.data.uploadedPdf);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching uploaded PDFs:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPdfs();
  }, [courseCode, user, navigate]);

  const handleView = (pdf) => {
    window.open(pdf.url, "_blank");
  };

  return (
    <div className="min-h-screen flex from-gray-100 via-gray-200 to-gray-300">
      <Sidebar />
      <div className="p-6 flex-1">
        <div className="mb-6 border-b-4 border-gray-500 pb-2">
          <h2 className="text-4xl font-extrabold text-[#121A27]">Uploaded PDFs</h2>
          <p className="text-gray-600 mt-2">Access course-related PDFs uploaded by professors and students.</p>
        </div>


        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <LoadingSpinner />
          </div>
        ) : uploadedPdfs.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 text-xl">No PDFs uploaded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-8 mt-10">
            {uploadedPdfs.map((pdf, idx) => (
              <div
                key={idx}
                className="relative w-64 h-40 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border border-gray-300 rounded-lg flex flex-col items-center justify-center shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                {/* PDF Icon and Name */}
                <div className="flex flex-col items-center">
                  <MdPictureAsPdf size={40} className="text-red-500" />
                  <p className="text-center text-md px-3 font-kanit font-semibold text-gray-800 truncate">
                    {pdf.name.substring(14)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between w-[80%] mt-4">
                  <button
                    onClick={() => handleView(pdf)}
                    className="flex items-center justify-center px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-200 hover:shadow-md transition duration-200"
                  >
                    <FaEye size={18} className="text-blue-600" />
                    <span className="ml-2 text-sm text-gray-700 font-semibold">View</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadedPdf;
