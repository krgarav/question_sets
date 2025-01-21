import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
function App() {
  const [name, setName] = useState("");
  const [excelFile, setExcelFile] = useState("");
  const [start, setStart] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("excelFile", excelFile);
      formData.append("start", Number(start));
      const response = await axios.post(
        `http://localhost:8000/api/v1/question-paper/genrate-question-sets`,
        formData
      );

      if (response.data.success) {
        console.log(response.data);
        toast.success("Sets Genrated Successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  const handleFileUpload = async (e) => {
    console.log(e.target.files[0]);
    setExcelFile(e.target.files[0]);
  };

  return (
    <>
      <div className="maincontainer">
        <h1 className="text-center">Generate Question Sets</h1>

        <div className="container authcontainer">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Folder Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Enter Folder Name"
                value={name}
                aria-describedby="emailHelp"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="start" className="form-label">
                Question Start From
              </label>
              <input
                type="number"
                className="form-control"
                id="start"
                name="start"
                placeholder="Enter a Number"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="xlsxFile" className="form-label">
                Select File
              </label>
              <input
                type="file"
                className="form-control"
                id="xlsxFile"
                name="xlsxFile"
                accept=".xlsx"
                onChange={handleFileUpload}
              />
            </div>

            <div className="mb-3 text-center">
              <button type="submit" className="btn btn-primary btn-lg">
                GENERATE SETS
              </button>
            </div>
          </form>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default App;
