import ReactCompareImage from "react-compare-image";

export default function RenderCompare({ preview, ai }) {
  return (
    <div className="w-full max-w-5xl mt-6">
      <ReactCompareImage leftImage={preview} rightImage={ai} />
    </div>
  );
}
