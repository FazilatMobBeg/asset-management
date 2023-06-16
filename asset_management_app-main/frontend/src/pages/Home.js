import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const naviagte = useNavigate();

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if image and department are selected
    if (!selectedImage || !selectedDepartment) {
      return;
    }

    // Create FormData object and append image and department
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("department", selectedDepartment);

    try {
      // Set loading state
      setIsLoading(true);
      const response = await fetch("http://192.168.29.28:80/process_image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        naviagte("/output", { state: { data } });
      } else {
        throw new Error("Error processing the image.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }

    // Reset form values
    setSelectedImage(null);
    setSelectedDepartment("");
  };

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg my-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Upload Image
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Department
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="Civil">Civil</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={!selectedImage || !selectedDepartment}
              >
                {isLoading ? (
                  <FaSpinner className="mx-2 animate-spin" size={20} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
          {selectedImage && (
            <div className="mt-8">
              <h2 className="text-lg font-bold mb-2 text-gray-800">
                Selected Image:
              </h2>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                className="max-w-full h-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
