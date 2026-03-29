import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Title, Text, Button } from '@tremor/react';
import { Mail, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const EVNInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/evn/invoices`, { withCredentials: true });
      setInvoices(response.data.invoices);
    } catch (err) {
      console.error("Error fetching EVN invoices:", err);
      setError(err.response?.data?.detail || "Failed to fetch invoices from Gmail. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title>EVN Invoices from Gmail</Title>
          <Text>Automatically extracted invoices from your Gmail account.</Text>
        </div>
        <Button 
          icon={RefreshCw} 
          onClick={fetchInvoices} 
          disabled={loading}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <Text color="red">{error}</Text>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <Text>Scanning your Gmail for EVN invoices...</Text>
          </div>
        ) : invoices.length > 0 ? (
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Invoice Number</TableHeaderCell>
                <TableHeaderCell>Customer Number</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <Text className="font-medium text-slate-900">{item.invoice_number}</Text>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text>{item.customer_number}</Text>
                  </TableCell>
                  <TableCell>
                    <Badge color="emerald">{item.amount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Text>{item.due_date}</Text>
                  </TableCell>
                  <TableCell>
                    <Badge color="indigo">Extracted</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-20">
            <Mail size={40} className="mx-auto text-slate-300 mb-4" />
            <Text>No EVN invoices found in your Gmail.</Text>
            <Text className="text-xs text-slate-400 mt-1">Search query: subject:"EVN FAKTURA"</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EVNInvoices;
