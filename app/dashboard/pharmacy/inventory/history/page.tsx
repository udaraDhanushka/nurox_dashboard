'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for order history
const orderHistory = [
  {
    id: 'ORD001',
    date: '2024-02-15',
    supplier: 'PharmaCorp Inc.',
    items: [
      { name: 'Amoxicillin 500mg', quantity: 200, unit: 'Tablets' },
      { name: 'Metformin 850mg', quantity: 150, unit: 'Tablets' },
    ],
    status: 'Delivered',
    total: 350,
  },
  {
    id: 'ORD002',
    date: '2024-02-14',
    supplier: 'MediSupply Ltd.',
    items: [{ name: 'Lisinopril 10mg', quantity: 100, unit: 'Tablets' }],
    status: 'Processing',
    total: 100,
  },
];

// Mock data for stock movements
const stockMovements = [
  {
    id: 'MOV001',
    date: '2024-02-15',
    item: 'Amoxicillin 500mg',
    type: 'Stock In',
    quantity: 200,
    unit: 'Tablets',
    reference: 'ORD001',
    updatedBy: 'John Williams',
  },
  {
    id: 'MOV002',
    date: '2024-02-15',
    item: 'Metformin 850mg',
    type: 'Stock Out',
    quantity: 30,
    unit: 'Tablets',
    reference: 'RX003',
    updatedBy: 'Sarah Chen',
  },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMovements = stockMovements.filter(movement => {
    const matchesSearch =
      movement.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory History</h2>
        <p className="text-muted-foreground">View order and stock movement history</p>
      </div>

      <Tabs defaultValue="orders" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={activeTab === 'orders' ? 'Search orders...' : 'Search movements...'}
              className="pl-8 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'orders' ? (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Stock In">Stock In</SelectItem>
                <SelectItem value="Stock Out">Stock Out</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-sm">
                              {item.name} ({item.quantity} {item.unit})
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map(movement => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{movement.id}</TableCell>
                      <TableCell>{movement.date}</TableCell>
                      <TableCell>{movement.item}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            movement.type === 'Stock In'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {movement.type === 'Stock In' ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {movement.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        {movement.quantity} {movement.unit}
                      </TableCell>
                      <TableCell>{movement.reference}</TableCell>
                      <TableCell>{movement.updatedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
