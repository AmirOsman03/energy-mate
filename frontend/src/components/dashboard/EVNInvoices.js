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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Title className="text-xl lg:text-2xl">EVN Invoices from Gmail</Title>
          <Text className="text-sm lg:text-base">Automatically extracted from your Gmail.</Text>
        </div>
        <Button 
          icon={RefreshCw} 
          onClick={fetchInvoices} 
          disabled={loading}
          loading={loading}
          className="w-full sm:w-auto"
        >
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200 p-4">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <Text color="red" className="text-sm">{error}</Text>
          </div>
        </Card>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 lg:py-20 space-y-4">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <Text className="text-sm">Scanning your Gmail...</Text>
            </div>
          ) : invoices.length > 0 ? (
            <Table className="min-w-[600px]">
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
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <Text className="font-medium text-slate-900 whitespace-nowrap text-sm">{item.invoice_number}</Text>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm">{item.customer_number}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge color="emerald" className="text-xs">{item.amount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm whitespace-nowrap">{item.due_date}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge color="indigo" className="text-xs">Extracted</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 lg:py-20 px-4">
              <Mail size={32} className="mx-auto text-slate-300 mb-4" />
              <Text className="text-sm">No EVN invoices found in your Gmail.</Text>
              <Text className="text-xs text-slate-400 mt-1 italic">Search query: from:efaktura@evnservice.mk ...</Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EVNInvoices;
