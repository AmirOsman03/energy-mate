import React from 'react';
import { Card, Text, Flex, ProgressBar, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Badge } from '@tremor/react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Ready': return 'emerald';
    case 'Beta': return 'amber';
    case 'Planned': return 'slate';
    default: return 'blue';
  }
};

const FeatureTable = ({ data }) => (
  <Card className="border-slate-200 shadow-sm p-0 overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="font-bold text-slate-900">Feature Usage Analytics</h3>
      <Text className="text-indigo-600 font-medium cursor-pointer hover:underline">View All Features</Text>
    </div>
    <Table>
      <TableHead className="bg-slate-50/50">
        <TableRow>
          <TableHeaderCell className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Feature Name</TableHeaderCell>
          <TableHeaderCell className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Status</TableHeaderCell>
          <TableHeaderCell className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Usage / Adoption Rate</TableHeaderCell>
          <TableHeaderCell className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Primary Context</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.name} className="hover:bg-slate-50/50 transition-colors">
            <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
            <TableCell>
              <Badge color={getStatusColor(item.status)} size="xs" variant="soft">
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="space-y-1.5 w-48">
                <Flex>
                  <Text className="text-xs font-medium text-slate-600">{item.adoption}%</Text>
                </Flex>
                <ProgressBar value={item.adoption} color="indigo" className="h-1.5" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                  {item.avatar}
                </div>
                <span className="text-sm text-slate-600">{item.company}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

export default FeatureTable;
