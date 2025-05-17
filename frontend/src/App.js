

import React, { useState } from "react";
import axios from "axios";

export default function DerivationApp() {
  const [inputWord, setInputWord] = useState("");
  const [ruleId, setRuleId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:5000/derive", {
        word: inputWord,
        ruleId,
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ge'ez Verb Derivation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Enter Ge'ez root word"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          required
        />
        <select
          className="border border-gray-300 p-2 w-full rounded"
          value={ruleId}
          onChange={(e) => setRuleId(e.target.value)}
          required
        >
          <option value="">Select Rule</option>
          <option value="1">ቀተለ (Rule 1)</option>
          <option value="2">ቀደሰ (Rule 2)</option>
          <option value="3">ተንበለ (Rule 3)</option>
          <option value="4">ባረከ (Rule 4)</option>
          <option value="5">ማህረከ (Rule 5)</option>
          <option value="6">ሴሰየ (Rule 6)</option>
          <option value="7">ክህለ (Rule 7)</option>
          <option value="8">ጦመረ (Rule 8)</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Derive Word
        </button>
      </form>

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Derived Forms:</h2>
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Form</th>
                <th className="border px-2 py-1">Derived Word</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result).map(([form, value]) => (
                <tr key={form}>
                  <td className="border px-2 py-1">{form}</td>
                  <td className="border px-2 py-1">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <p className="mt-4 text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
