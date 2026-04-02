import { useState, useEffect } from 'react'
import api from '../services/api'


const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalExpenses: 0,
        profit: 0
    })

    useEffect(() => {
        fetchSummary()
    }, [])

    const fetchSummary = async () => {
        try {
            const res = await api.get("/transactions/summary")
            setSummary(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>

            <div>Dashboard</div>
            <p>Total Sales: {summary.totalSales}</p>
            <p>Total Expenses: {summary.totalExpenses}</p>
            <p>Profit: {summary.profit}</p>
        </div>
    )
}

export default Dashboard