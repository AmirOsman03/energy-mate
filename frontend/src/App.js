import React, {useState, useEffect} from 'react';

function App() {
    const [invoices, setInvoices] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch summary and invoices in parallel
        Promise.all([
            fetch('http://127.0.0.1:8000/summary').then(res => res.json()),
            fetch('http://127.0.0.1:8000/invoices').then(res => res.json())
        ])
            .then(([summaryData, invoicesData]) => {
                setSummary(summaryData);
                setInvoices(invoicesData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data from backend');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif'}}>
            <h1>Energy Mate Dashboard</h1>

            {summary && (
                <div style={{border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                    <h2>Summary</h2>
                    <p><strong>Total Consumption:</strong> {summary.total_kwh} kWh</p>
                    <p><strong>Total Amount:</strong> ${summary.total_amount}</p>
                    {summary.alerts && (
                        <div style={{color: 'red', fontWeight: 'bold'}}>
                            Alert: {summary.alerts}
                        </div>
                    )}
                </div>
            )}

            <h2>Recent Invoices</h2>
            <table border="1" cellPadding="10" style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                <tr style={{backgroundColor: '#f4f4f4'}}>
                    <th>Month</th>
                    <th>kWh</th>
                    <th>Amount</th>
                    <th>Date Created</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map(invoice => (
                    <tr key={invoice.id}>
                        <td>{invoice.month}</td>
                        <td>{invoice.kwh}</td>
                        <td>${invoice.amount}</td>
                        <td>{invoice.created_at}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
