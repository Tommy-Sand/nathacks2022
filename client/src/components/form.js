import React, { useRef } from "react";
import axios from "axios";

function Form(props) {
  const ref = useRef(null);

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
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="myForm">Select a file</label>
        <div></div>
        <input type="file" ref={ref} />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

export default Form;
