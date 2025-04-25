"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult("");
      setConfidence(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/predict", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data.result);
      setConfidence(data.confidence);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">Brain Tumor Detection</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-700 rounded-lg shadow-md tracking-wide uppercase border border-blue-300 cursor-pointer hover:bg-blue-50">
            <span className="mt-2 text-base leading-normal">Select a brain image</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Detecting..." : "Detect"}
          </button>
        </form>
        {preview && (
          <div className="mt-6">
            <img src={preview} alt="Preview" className="w-full object-contain rounded-md border" />
          </div>
        )}
        {result && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <p className="text-2xl font-bold text-blue-800 text-center">{result}</p>
            {confidence !== null && <p className="text-blue-800 mt-2 text-center">Confidence: {(confidence * 100).toFixed(2)}%</p>}
          </div>
        )}
      </div>
    </div>
  );
}
