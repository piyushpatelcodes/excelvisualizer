import { notFound } from "next/navigation";

interface Sale {
  "Invoice Date": string;
  "Month": string;
  "Quarter": number;
  "Year": number;
  "Bill No": string;
  "Customer No": number;
  "Customer Name": string;
  "Customer Type": string;
  "Sub Type": string;
  "Product Group": string;
  "Product Name": string;
  "Quantity": number;
  "Total Amount": number;
  "Payment Terms": string;
  "Region": string;
  "Region Code": string;
  "Cluster": string;
  "Cluster Head": string;
  "PRODUCT CODE": string;
  "UNIT PRICE": number;
  "DISCOUNT": number;
  "NET PRICE": number;
  "DUE DATE": string;
  "INVOICE NO.": string;
}

// Fetch all sales data
async function getCustomerSales(customerId: string): Promise<Sale[]> {
  const res = await fetch("http://localhost:3000/api/sales"); // Replace with actual API URL
  if (!res.ok) return [];

  const salesData = await res.json();
  const allSales: Sale[] = salesData[0].data; // Extracting sales data from response

  return allSales.filter((sale) => sale["Customer No"].toString() === customerId);
}

export default async function CustomerSalesPage({ params }: { params: { customerId: string } }) {
  const customerSales = await getCustomerSales(params.customerId);

  if (customerSales.length === 0) return notFound(); // If no data found, show 404

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Sales Data for {customerSales[0]["Customer Name"]}</h1>
      <p className="text-gray-600">Customer ID: {params.customerId}</p>

      {/* Sales Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Invoice Date</th>
              <th className="border p-2">Bill No</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Region</th>
              <th className="border p-2">Cluster</th>
              <th className="border p-2">Due Date</th>
            </tr>
          </thead>
          <tbody>
  {customerSales
    .sort((b,a) => new Date(a["Invoice Date"]).getTime() - new Date(b["Invoice Date"]).getTime()) // Sort by date
    .map((sale) => (
      <tr key={sale["Invoice Date"]} className="border">
        <td className="border p-2">{new Date(sale["Invoice Date"]).toLocaleDateString()}</td>
        <td className="border p-2">{sale["Bill No"]}</td>
        <td className="border p-2">{sale["Product Name"]}</td>
        <td className="border p-2">{sale["Quantity"]}</td>
        <td className="border p-2">₹{sale["Total Amount"].toLocaleString()}</td>
        <td className="border p-2">{sale["Region"]}</td>
        <td className="border p-2">{sale["Cluster"]}</td>
        <td className="border p-2">{new Date(sale["DUE DATE"]).toLocaleDateString()}</td>
      </tr>
    ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
