import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AssetDetailsPage = () => {
  const { invoice_id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(
        `http://192.168.29.28:80/invoices/${invoice_id}`
      );
      if (!response.ok) {
        throw new Error("Error fetching invoice");
      }
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      // Handle the error, display an error message, or perform any other necessary actions
    }
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Invoice Details</h1>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(invoice).map(([key, value]) => (
          <div key={key} className="p-4 border border-gray-300 rounded-lg">
            <h2 className="mb-2 text-lg font-semibold">{key}</h2>
            <p className="text-gray-600">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};