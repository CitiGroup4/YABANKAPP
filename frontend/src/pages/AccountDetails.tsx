import { useParams } from "react-router-dom";


function AccountDetails() {

  const { id } = useParams();


  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96">

        <h1 className="text-3xl font-bold mb-6">
          Account Details
        </h1>


        <div className="space-y-3">

          <p>
            <strong>Account ID:</strong> {id}
          </p>


          <p>
            <strong>User Name:</strong> John Doe
          </p>


          <p>
            <strong>Balance:</strong> $5,420.75
          </p>

        </div>


        <div className="flex flex-col gap-3 mt-8">

          <button className="bg-green-600 text-white py-2 rounded-lg">
            Deposit
          </button>


          <button className="bg-red-600 text-white py-2 rounded-lg">
            Withdraw
          </button>


          <button className="bg-slate-700 text-white py-2 rounded-lg">
            View Transactions
          </button>

        </div>

      </div>

    </div>
  );
}


export default AccountDetails;