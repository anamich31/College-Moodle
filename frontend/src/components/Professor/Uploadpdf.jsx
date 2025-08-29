import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { MdDelete, MdPictureAsPdf } from "react-icons/md";
import { FaEye } from "react-icons/fa";

// A simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center mt-10">
    <div className="animate-spin border-t-4 border-gray-500 border-solid w-12 h-12 rounded-full"></div>
  </div>
);

function UploadPdf() {
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // New loading state for uploading
  const [isDeleting, setIsDeleting] = useState(false); // New loading state for deleting

  const { courseCode } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.app);

  // Fetch uploaded PDFs on component mount
  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      try {
        if (user && user._id) {
          const response = await axios.get(
            `${USER_API_END_POINT}/professor/courses/${courseCode}/getpdf`,
            { withCredentials: true }
          );
          setUploadedPdfs(response.data.uploadedPdf); // Updated structure with objects
          console.log(response.data.uploadedPdf);
        } else {
          navigate("/"); // Redirect to login if unauthenticated
        }
      } catch (error) {
        console.error("Error fetching uploaded PDFs:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUploadedPdfs();
  }, [courseCode, user, navigate,isUploading]);

  // Handle PDF upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);
  
      try {
        setIsUploading(true);
  
        const response = await axios.post(
          `${USER_API_END_POINT}/professor/courses/${courseCode}/uploadpdfbysupabase`,
          formData,
          { withCredentials: true }
        );
  
        if (response.data.success) {
          const newPdf = {
            url: `${response.data.pdfUrl}.pdf`, // Append .pdf to the URL
            name: file.name,
          };
  
          setUploadedPdfs((prev) => [...prev, newPdf]);
          setIsUploadModalOpen(false);
        } else {
          console.error("Failed to upload PDF:", response.data.message);
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  function handleview(pdf) {
    window.open(pdf.url, "_blank");
  }

  // Handle PDF delete
  const handleDelete = async () => {
    setIsDeleting(true); // Start deleting process
    try {
      const pdfname = selectedPdf.name; // Access `url` from the selected PDF object
      
      const url = selectedPdf.url;
      const response = await axios.delete(
        `${USER_API_END_POINT}/professor/courses/${courseCode}/deletepdfbysupabase/${pdfname}`,
        {
          data: { pdfUrl: url }, // Send pdfUrl in the request body
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUploadedPdfs((prev) => prev.filter((pdf) => pdf.url !== url));
        setIsDeleteModalOpen(false);
        setSelectedPdf(null);
      } else {
        console.error("Failed to delete PDF:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
    } finally {
      setIsDeleting(false); // End deleting process
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
  {/* Sidebar Component */}
  <Sidebar />
  
  <div className="p-6 flex-1">
    <h1 className="text-[40px] font-bold font-kanit text-[#121A27] border-b-4 border-gray-500 pb-2 mt-14 md:mt-6">Upload PDF</h1>

    {loading ? (<LoadingSpinner/>) :
      (
        <div className="flex flex-wrap gap-6 mt-10 ">
        {uploadedPdfs.map((pdf, idx) => (
          <div
            key={idx}
            className="relative w-56 h-32 border border-gray-300 gap-4 rounded-lg flex flex-col items-center justify-center bg-white shadow-md transform transition-transform duration-300 hover:scale-110"
          >
            <div className="flex items-center">
            <MdPictureAsPdf size={23} />
            <p className="text-center text-lg px-2 font-kanit font-semibold text-[#121A27]">{pdf.name.substring(14)}</p>
            </div>

            <div className="flex justify-between w-[80%]">

            <button onClick={()=> handleview(pdf)}>
            <FaEye size={23} className="text-[#121A27] hover:text-blue-600" />
            </button>

            <button
              onClick={() => {
                setSelectedPdf(pdf);
                setIsDeleteModalOpen(true);
              }}
              className=" right-2 text-[#121A27] hover:text-red-500 z-10"
            >
              <MdDelete size={25} />
            </button>
            
            </div>
            
          </div>
    ))}

    {/* Add PDF Box */}
    <div
      onClick={() => setIsUploadModalOpen(true)}
      className="w-56 h-32 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
    >
      <span className="text-gray-400 text-4xl">+</span>
    </div>
  </div>
      )
    }
    

    {/* Upload Modal */}
    <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-kanit border-b-2 border-gray-300 pb-2 text-[#121A27] text-2xl' >Upload PDF</DialogTitle>
        </DialogHeader>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 font-kanit"
        />
        {isUploading && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner />
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Modal */}
    <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-kanit border-b-2 border-gray-300 pb-2 text-[#121A27] text-2xl'>Delete Confirmation</DialogTitle>
        </DialogHeader >
        <p className='font-kanit'>Are you sure you want to delete {selectedPdf?.name.substring(14)}?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>

  );
}

export default UploadPdf;
