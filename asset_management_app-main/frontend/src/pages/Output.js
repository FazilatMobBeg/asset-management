import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const OutputPage = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setData(location.state.data);
  }, [location.state]);

  const handleStoreData = async () => {
    try {
      const response = await fetch("http://192.168.29.28:80/add_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        throw new Error("Error storing data.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveKey = (key) => {
    const updatedData = { ...data };
    delete updatedData[key];
    setData(updatedData);
  };

  return (
    <div className="min-h-screen py-8 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between header">
          <h1 className="mb-8 text-3xl font-bold">Data</h1>
          <button
            className="px-4 py-2 mb-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            onClick={handleStoreData}
          >
            Store Data
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex justify-between mb-2 text-lg font-semibold">
                <span>{key}</span>
                <button
                  className="font-bold text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveKey(key)}
                >
                  x
                </button>
              </div>
              <div className="text-gray-600">{value}</div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="p-8 bg-white rounded-lg">
            <h2 className="mb-4 text-2xl font-bold">Success!</h2>
            <p>Data has been successfully stored.</p>
            <button
              className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputPage;
