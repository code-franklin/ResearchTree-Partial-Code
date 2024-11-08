import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";
import Searching from "./SearchInput";
// import './Styles/Search.css';

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

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:7000/api/advicer/get-files");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDF files:", error);
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
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (result.data.status === "ok") {
        alert("Uploaded Successfully!");
        await getPdf();
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:7000/files/${pdf}`);
  };

  const handleSearch = async () => {
    try {
      const result = await axios.post("http://localhost:7000/api/advicer/search", {
        searchQuery,
      });
      setSearchResults(result.data.data);
    } catch (error) {
      console.error("Error searching PDF files:", error);
    }
  };

  return (
    <div className="App bg-gray-900 min-h-screen p-8 text-white flex flex-col items-center ml-[1000px] mt-[500px]">
      <form
        className="formStyle bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        onSubmit={submitImage}
      >
        <h4 className="text-lg font-semibold">Upload PDF</h4>



        <input
          type="text"
          placeholder="Title"
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Authors"
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setAuthors(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date Uploaded"
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setDateUploaded(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date Published"
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setDatePublished(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          required
          className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
        >
          Submit
        </button>
      </form>

      <div className="search-section mt-8 w-full max-w-md">
        {/* <div className="flex items-center space-x-2">
          <input
            className="flex-grow p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder="Search PDFs by title"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute ml-[900px]bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-semibold"
            onClick={handleSearch}
          >
            Searchddddddddddddddddddddddddd
          </button>
        </div> */}

        <div className="search-results mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Search Results:</h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-400">No results found.</p>
          ) : (
            searchResults.map((data, index) => (
              <div key={index} className="mt-4 p-2 bg-gray-700 rounded">
                <h6>Title: {data.title}</h6>
                <h6>Authors: {data.authors}</h6>
                <h6>Date Uploaded: {data.dateUploaded}</h6>
                <h6>Date Published: {data.datePublished}</h6>
                <button
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 p-1 rounded font-semibold"
                  onClick={() => showPdf(data.pdf)}
                >
                  Show PDF
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
}

export default App;
