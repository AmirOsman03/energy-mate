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
          <Title className="text-xl lg:text-2xl text-slate-900 dark:text-slate-50 transition-colors">
            EVN Invoices from Gmail
          </Title>
          <Text className="text-sm lg:text-base text-slate-500 dark:text-slate-400">
            Automatically extracted from your Gmail.
          </Text>
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
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 p-4">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle size={20} className="shrink-0" />
            <Text color="red" className="text-sm dark:text-red-400">{error}</Text>
          </div>
        </Card>
      )}

      {/* Main Container */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={28} />
            <Text className="text-sm dark:text-slate-300">Scanning Gmail...</Text>
          </div>
        ) : invoices.length > 0 ? (
          <>
            {/* Mobile Card Layout - iPhone Style */}
            <div className="block sm:hidden space-y-3">
              {invoices.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        <Mail size={18} />
                      </div>
                      <div>
                        <Text className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.invoice_number}</Text>
                        <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Invoice ID</Text>
                      </div>
                    </div>
                    <Badge color="indigo" size="xs" className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border-none bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">EXTRACTED</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div>
                      <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1.5">Amount</Text>
                      <Badge color="emerald" size="xs" className="font-bold border-none bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        {typeof item.amount === 'number' ? item.amount.toFixed(2) : parseFloat(item.amount).toFixed(2)} ден
                      </Badge>
                    </div>
                    <div className="text-right">
                      <Text className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1.5">Due Date</Text>
                      <Text className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{item.due_date}</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors">
              <Table className="min-w-[600px]">
                <TableHead className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHeaderCell className="dark:text-slate-400 uppercase tracking-wider">Invoice Number</TableHeaderCell>
                    <TableHeaderCell className="dark:text-slate-400 uppercase tracking-wider">Customer Number</TableHeaderCell>
                    <TableHeaderCell className="dark:text-slate-400 uppercase tracking-wider">Amount</TableHeaderCell>
                    <TableHeaderCell className="dark:text-slate-400 uppercase tracking-wider">Due Date</TableHeaderCell>
                    <TableHeaderCell className="dark:text-slate-400 uppercase tracking-wider">Status</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400 shrink-0" />
                          <Text className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap text-sm">{item.invoice_number}</Text>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Text className="text-sm dark:text-slate-300">{item.customer_number}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge color="emerald" className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-none">
                          {(item.amount ? (typeof item.amount === 'number' ? item.amount : parseFloat(item.amount)) : 0).toFixed(2)} ден
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text className="text-sm dark:text-slate-300 whitespace-nowrap">{item.due_date}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge color="indigo" className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-none">Extracted</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="text-center py-16 lg:py-20 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <Mail size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <Text className="text-sm dark:text-slate-200">No EVN invoices found in your Gmail.</Text>
            <Text className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">Search query: from:efaktura@evnservice.mk ...</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default EVNInvoices;