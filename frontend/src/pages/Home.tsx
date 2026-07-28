import { useNavigate } from "react-router-dom";


function Home() {

  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h1 className="text-4xl font-bold text-center text-blue-700">
          Yet Another Bank
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Banking Management System
        </p>


        <div className="flex flex-col gap-4">

          <button
            onClick={() => navigate("/create-account")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Create Account
          </button>


          <button
            onClick={() => navigate("/account/101")}
            className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg"
          >
            View Account
          </button>

        </div>

      </div>

    </div>
  );
}


export default Home;