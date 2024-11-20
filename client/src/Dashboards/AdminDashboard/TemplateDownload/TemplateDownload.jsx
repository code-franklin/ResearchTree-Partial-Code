import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "../../AdviserDashboard/Sidebar/PdfComp";
import { Modal, Box, Button, Typography } from "@mui/joy";
import { fontSize, fontWeight } from "@mui/system";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [dateUploaded, setDateUploaded] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [file, setFile] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.get("http://localhost:7000/get-files");
      if (result?.data?.data) {
        setAllImage(result.data.data);
      } else {
        setError("No data received from the server.");
      }
    } catch (error) {
      console.error("Error fetching PDF files:", error);
      setError(error.response?.data?.message || "Failed to fetch PDF files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("authors", authors);
    formData.append("dateUploaded", dateUploaded);
    formData.append("datePublished", datePublished);
    formData.append("file", file);

    try {
      const result = await axios.post(
        "http://localhost:7000/api/advicer/upload-files", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (result.data.status === "ok") {
        alert("Uploaded Successfully!");
        await getPdf();
        setOpen(false); // Close modal after upload
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setError(error.response?.data?.message || "Error uploading PDF. Please try again.");
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:7000/files/${pdf}`);
  };

  const handleSearch = async () => {
    try {
      const result = await axios.post("http://localhost:7000/search", { searchQuery });
      setSearchResults(result.data.data);
    } catch (error) {
      console.error("Error searching PDF files:", error);
      setError(error.response?.data?.message || "Error searching PDFs. Please try again.");
    }
  };

  return (
    <div className="container mx-auto w-[500px] px-4 py-4 font-sans text-[#222222] fixed mt-[180px] ml-[30px]">
     <Button 
  variant="solid" 
  sx={{ 
    background: '#4B4B4B', 
    height: '50px', 
    width: '200px', 
    '&:hover': { backgroundColor: '#0BF677' }
  }} 
  onClick={() => setOpen(true)}
>
  Upload Manuscript <span className="ml-2"><PictureAsPdfIcon/></span>
</Button>


      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
            maxWidth: 400,
            mx: "auto",
            p: 3,
            bgcolor: "#222222",
            borderRadius: 10,
            marginTop: '250px',
            border: "1px solid #4B4B4B" // Add white border here
         }}>
          <Typography style={{color:'white', fontSize: '20px', fontWeight: '900'}} level="h6" mb={1}>Upload Manuscript</Typography>
          <form className="space-y-2" onSubmit={submitImage}>
          
            <input
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-1 text-sm text-[#222222] border border-gray-300 rounded text-white"
            />
           <Button 
  type="submit" 
  fullWidth 
  variant="solid"
  sx={{
    background: '#0BF677',
    '&:hover': {
      backgroundColor: '#04A45C', // Slightly darker green for hover
    },
    transition: 'background-color 0.3s ease', // Smooth transition effect
  }}
>
  Submit
</Button>

          </form>
        </Box>
      </Modal>

      {loading && <p>Loading PDFs...</p>}
      {/* {error && <p className="text-red-600">{error}</p>} */}

      {/* <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium text-[#222222] mb-2">PDF Files</h4>
        {allImage.length === 0 ? (
          <p>No PDFs found. Please upload some files.</p>
        ) : (
          allImage.map((pdf, index) => (
            <div key={index} className="p-2 mb-2 bg-gray-200 rounded">
              <h6 className="font-medium text-sm text-[#222222]">Title: {pdf.title}</h6>
              <p className="text-xs text-[#222222]">Authors: {pdf.authors}</p>
              <p className="text-xs text-[#222222]">Date Uploaded: {pdf.dateUploaded}</p>
              <p className="text-xs text-[#222222]">Date Published: {pdf.datePublished}</p>
              <button
                onClick={() => showPdf(pdf.pdf)}
                className="mt-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
              >
                Show PDF
              </button>
            </div>
          ))
        )}
      </div> */}

      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default App;
