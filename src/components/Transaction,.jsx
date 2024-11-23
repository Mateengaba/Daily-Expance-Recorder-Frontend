import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASEURL } from '../confg';
import Navbar from './Navbar';



function Transaction() {


  const [amount, setAmount] = useState('');
  const [type, setType] = useState('#');
  const [transaction, setTransaction] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [date, setDate] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Edit mode flag
  const [editIndex, setEditIndex] = useState(null);  // Track edit transaction's index
  const [loading, setLoading] = useState(true); // Loading state for loader


  // Add/Save transaction
  const handletransaction = async () => {
    const trimmedAmount = amount.trim();
    const trimmedRemarks = remarks.trim();
    const trimmedDate = date.trim();

    if (!trimmedAmount || type === '#' || !trimmedRemarks || !trimmedDate) {
      return alert('Please fill all fields');
    }

    const transactionData = {
      amount: parseFloat(trimmedAmount),
      type,
      remarks: trimmedRemarks,
      date: trimmedDate,
    };

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID is missing. Please log in first.");
      return;
    }

    if (!token) {
      alert("Authorization token is missing. Please log in first.");
      return;
    }

    try {
      if (isEditing) {
        const response = await axios.put(
          `${BASEURL}/update/transactions/${transaction[editIndex]._id}`,
          transactionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedTransactions = transaction.map((item, i) =>
          i === editIndex ? response.data : item
        );
        setTransaction(updatedTransactions);
        alert("Transaction updated successfully!");
        setIsEditing(false);
        setEditIndex(null);
      } else {
        const response = await axios.post(
          `${BASEURL}/createtransactions/${userId}`,
          transactionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Log the response data to see what is returned
        console.log("Transaction created:", response.data);

        // Update the state with the new transaction using 'transactions' (note spelling)
        setTransaction([...transaction, response.data]); // 'transactions' should be used here
        alert("Transaction added successfully!");
      }

      // Reset fields after success
      setAmount('');
      setType('#');
      setRemarks('');
      setDate('');
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      alert('Error saving transaction');
    }
  };
  // Fetch data from DATABASE

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token is missing. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASEURL}/getall/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.status && response.data.data) {
          // `data` key se transactions ko set karna
          setTransaction(response.data.data);
        } else {
          console.log("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.log("Error fetching transactions:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Edit function
  const edititem = (index) => {
    if (index < 0 || index >= transaction.length) {
      console.error("Invalid index");
      return;
    }
    // selectedTransaction ab us transaction ka object hai, jo aap edit karna chahte hain.
    const selectedTransaction = transaction[index]; // Yeh line transaction array se index ki madad se specific transaction ko uthati hai.

    // Yeh lines selectedTransaction ki properties (amount, type, remarks, date) ko respective state variables mein set karti hain.
    setAmount(selectedTransaction.amount);
    setType(selectedTransaction.type);
    setRemarks(selectedTransaction.remarks);
    setDate(selectedTransaction.date);

    // Iska matlab hai ke aap ab edit mode mein hain, aur form ko update karne ke liye tayyar hain.
    setIsEditing(true);
    setEditIndex(index);
  };


  // delete function
  // filter() method use hota hai taake transactions array se woh item nikaala ja sake jo delete karna hai.
  //i (index of the current item) match nahi karta index (jisse delete karna hai), toh woh item array mein rahega.

  const deleteitem = async (id, index) => {
    try {
      const response = await axios.delete(`${BASEURL}/delete/transactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log(response.data.message);

      // Filter out the deleted transaction
      const updatedTransactions = transaction.filter((_, i) => i !== index);
      setTransaction(updatedTransactions);
      alert("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error.response?.data || error.message);
      alert("Failed to delete transaction");
    }
  };


  // deleteAll

  const deleteAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authorization token is missing. Please log in first.");
        return;
      }

      const response = await axios.delete(`${BASEURL}/deleteAll/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`, // Token header mein send karein
        },
      });

      console.log(response.data.message);
      setTransaction([]); // Clear transactions from state
      alert('All transactions deleted successfully!');
    } catch (error) {
      console.log("Error:", error.message);
      alert('Error deleting transactions');
    }
  };

  // total incom function

  let totalIncome = 0;
  let totalExpense = 0;

  //forEach() loop ko use kiya gaya hai jo transaction array ko iterate karta hai.
  transaction.forEach((item) => {
    const amount = Number(item.amount); //Har transaction ke liye, pehle amount ko Number mein convert kiya jata hai (jo bhi amount hai).

    //check kiya jata hai ke type "income" hai ya "expense", totalIncome ya totalExpense mein add kiya jata hai.
    if (item.type === "income") {
      totalIncome += amount;
    } else if (item.type === "expense") {
      totalExpense += amount;
    }
  });

  const balanceAmount = totalIncome - totalExpense;



  // date format
  function formatDate(dateString) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).replace(",", "");
  }




  return (

    <div>
      <Navbar />
      <h1 className="text-3xl font-bold underline text-center text-cyan-600 mb-6 my-10">
        Monthly Income & Expance!
      </h1>

      <div className='flex flex-col justify-center items-center my-2 px-2 md:px-8'>

        {/* Income, Expense, Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl my-10">
          <div className="w-full bg-white border border-gray-700 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-6">
              <h5 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Income</h5>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-400">
                {"Rs: "}{totalIncome}
              </span>
            </div>
          </div>
          <div className="w-full bg-white border border-gray-700 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-6">
              <h5 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Expense</h5>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-400">
                {"Rs: "}{totalExpense}
              </span>
            </div>
          </div>
          <div className="w-full bg-white border border-gray-700 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-6">
              <h5 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Balance</h5>
              <span className={`text-lg font-bold ${balanceAmount < 0 ? 'text-red-500' : 'text-gray-900'} dark:${balanceAmount < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {"Rs: "}{balanceAmount}
              </span>
            </div>
          </div>
        </div>


        {/* input field  */}
        <div className='flex flex-col md:flex-row w-full justify-center items-center'>

          <input
            value={amount}
            type="number"
            placeholder='Add amount'
            onChange={(e) => setAmount(e.target.value)}
            className='border border-blue-600 mx-3 p-2 rounded-lg w-full md:w-auto mb-3 md:mb-0'
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='border border-blue-600 mx-3 p-2 rounded-lg w-full md:w-auto mb-3 md:mb-0'>
            <option className='p-2' value="#" disabled>Select type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='border border-blue-600 mx-3 p-2 rounded-lg w-full md:w-auto mb-3 md:mb-0'
          />

          <input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className='border border-blue-600 mx-3 p-2 rounded-lg w-full md:w-auto mb-3 md:mb-0'
            type="text"
            placeholder='Enter Your Remarks'
          />

          <button
            onClick={handletransaction}
            className="border border-blue-600 p-2 px-4 mx-5 rounded-lg font-bold bg-cyan-400 hover:bg-cyan-500 transition-all w-full md:w-auto my-3">
            {isEditing ? "Update" : "Add"}
          </button>
          <button
            onClick={deleteAll}
            className="border border-blue-600 p-2 px-4 rounded-lg font-bold bg-red-400 hover:bg-red-500 transition-all w-full md:w-auto">
            Month End! Clear All
          </button>
        </div>

        <div>


        </div>


        <div className='w-full mt-6'>
          {
            transaction.map((data, index) => {
              return (

                <div key={index} className='flex flex-col md:flex-row items-center mx-10 my-4 p-2 w-auto border border-blue-600 rounded-lg'>

                  <div className='flex flex-col md:flex-row items-center w-full'>
                    <h1 className='font-bold text-xl md:text-3xl w-full md:w-1/4'>{index + 1}{") "} {data.amount}</h1>
                    <h1 className={`font-bold underline text-xl md:text-3xl w-full md:w-1/4 ${data.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {data.type}
                    </h1>
                    <h1 className='font-bold text-xl md:text-3xl w-full md:w-1/4'>{formatDate(data.date)}</h1>
                    <h1 className='font-bold text-xl md:text-3xl w-full md:w-1/4'>{data.remarks}</h1>
                  </div>
                  <div className='flex gap-3 mt-3 md:mt-0'>
                    <button
                      onClick={() => edititem(index)}
                      className='border border-blue-600 rounded-lg p-2 px-5 font-bold bg-cyan-400 hover:bg-cyan-500 cursor-pointer transition-all'>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => deleteitem(transaction[index]._id, index)}     // yahan par transaction[index]._id ka istemal karein
                      className='border border-blue-600 rounded-lg p-2 px-5 font-bold bg-red-500 hover:bg-red-600 cursor-pointer transition-all'>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>


    </div>
  )
}

export default Transaction
