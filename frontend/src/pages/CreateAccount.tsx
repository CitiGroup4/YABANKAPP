function CreateAccount() {

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>


        <div className="flex flex-col gap-4">

          <input
            placeholder="Name"
            className="border p-3 rounded-lg"
          />


          <input
            placeholder="Email"
            className="border p-3 rounded-lg"
          />


          <select
            className="border p-3 rounded-lg"
          >
            <option>
              Checking
            </option>

            <option>
              Savings
            </option>

          </select>


          <button
            className="bg-blue-600 text-white py-3 rounded-lg"
          >
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}


export default CreateAccount;