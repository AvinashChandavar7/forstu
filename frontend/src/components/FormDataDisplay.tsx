import React from 'react';

interface FormDataDisplayProps {
  formData?: {
    username: string;
    email: string;
    state: string;
    pending: {
      university: string;
      eligibilityCriteria: string;
      phoneNumber: string[];
      phNumbers: { number: string }[];
    };
    age: number;
    dob: Date;
  };
}


const FormDataDisplay: React.FC<FormDataDisplayProps> = ({ formData }) => {
  if (!formData) {
    return <p className="text-gray-500">No form data available.</p>;
  }

  const formattedDob = formData.dob.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });


  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Form Data</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Field</th>
              <th className="px-4 py-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Username</td>
              <td className="px-4 py-2">{formData.username}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Email</td>
              <td className="px-4 py-2">{formData.email}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">State</td>
              <td className="px-4 py-2">{formData.state}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">University</td>
              <td className="px-4 py-2">{formData.pending.university}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Eligibility Criteria</td>
              <td className="px-4 py-2">{formData.pending.eligibilityCriteria}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Primary Phone Number</td>
              <td className="px-4 py-2">{formData.pending.phoneNumber[0]}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Secondary Phone Number</td>
              <td className="px-4 py-2">{formData.pending.phoneNumber[1]}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">List of Phone Numbers</td>
              <td className="px-4 py-2">{formData.pending.phNumbers.map((ph) => ph.number).join(', ')}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Age</td>
              <td className="px-4 py-2">{formData.age}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-semibold">Date of Birth</td>
              <td className="px-4 py-2">{formattedDob}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormDataDisplay;
