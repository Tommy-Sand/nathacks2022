import React, { useContext, useRef } from "react";
import axios from "axios";
import { ActivityContext } from "../context/ActivityDataContext";
import { useNavigate } from "react-router-dom";

function Form(props) {
  const { setData } = useContext(ActivityContext);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const uploadedFile = ref.current;
    formData.append("eeg_file", uploadedFile.files[0]);
    formData.append("duration", 60);
    try {
      const res = await axios.post("http://127.0.0.1:5000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(res.data);
      navigate("/mountains");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="main-heading">Visualize Brain Activity</h1>
      <div className="center-box">
        <h1>Convert EEG data to soundscapes</h1>
        <div>=======================</div>
        <form className="file-form" onSubmit={handleSubmit}>
          <label htmlFor="myForm">
            <h2>Select your eeg data</h2>
          </label>
          <div>=========================</div>
          <input type="file" ref={ref} />
          <div>=========================</div>
          <button className="mybtn" type="submit">
            submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Form;
