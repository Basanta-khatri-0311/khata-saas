import { useState, useEffect } from 'react'
import api from '../services/api'


const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalExpenses: 0,
        profit: 0
    })

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchSummary()
        fetchTransactions()
    }, [])

    const fetchSummary = async () => {
        try {
            const res = await api.get("/transactions/summary")
            setSummary(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions")
            setTransactions(res.data)

        } catch (error) {
            console.log(error)
        }
    }

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`)
            fetchTransactions() // Refresh the transaction list after deletion
            fetchSummary() // Refresh the summary after deletion

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>

            <div>
                <h2>Dashboard</h2>

                <p>Total Sales: {summary.totalSales}</p>
                <p>Total Expenses: {summary.totalExpenses}</p>
                <p>Profit: {summary.profit}</p>
            </div>

            <div>
                <h2>Transaction history</h2>
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction._id}>
                            {transaction.type} - {transaction.amount} - {transaction.note}
                            <button onClick={() => deleteTransaction(transaction._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default Dashboard