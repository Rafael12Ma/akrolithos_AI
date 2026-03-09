export default function GenerateButton({ generating, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={generating}
      className="px-6 py-3 bg-white text-black rounded-xl font-semibold disabled:opacity-50"
    >
      {generating ? "Rendering..." : "Generate Photorealistic Render"}
    </button>
  );
}
