import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="rounded-xl bg-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-amber-600">
          Tailwind Working
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Gianluigi dashboard Tailwind CSS is working correctly.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;