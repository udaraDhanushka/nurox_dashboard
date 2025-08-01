'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Plus, AlertTriangle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

// Mock data
const inventory = [
  {
    id: 'MED001',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    quantity: 150,
    unit: 'Tablets',
    supplier: 'PharmaCorp Inc.',
    reorderPoint: 100,
    status: 'In Stock',
    expiryDate: '2025-06-15',
  },
  {
    id: 'MED002',
    name: 'Lisinopril 10mg',
    category: 'Cardiovascular',
    quantity: 80,
    unit: 'Tablets',
    supplier: 'MediSupply Ltd.',
    reorderPoint: 100,
    status: 'Low Stock',
    expiryDate: '2025-08-20',
  },
  {
    id: 'MED003',
    name: 'Metformin 850mg',
    category: 'Diabetes',
    quantity: 0,
    unit: 'Tablets',
    supplier: 'PharmaCorp Inc.',
    reorderPoint: 100,
    status: 'Out of Stock',
    expiryDate: '2025-07-10',
  },
];

// Form schemas
const updateStockSchema = z.object({
  quantity: z.string().transform(val => parseInt(val, 10)),
  reason: z.string().min(1, 'Reason is required'),
});

const newItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z.string().transform(val => parseInt(val, 10)),
  unit: z.string().min(1, 'Unit is required'),
  supplier: z.string().min(1, 'Supplier is required'),
  reorderPoint: z.string().transform(val => parseInt(val, 10)),
});

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const updateStockForm = useForm({
    resolver: zodResolver(updateStockSchema),
    defaultValues: {
      quantity: '',
      reason: '',
    },
  });

  const newItemForm = useForm({
    resolver: zodResolver(newItemSchema),
    defaultValues: {
      name: '',
      category: '',
      quantity: '',
      unit: '',
      supplier: '',
      reorderPoint: '',
    },
  });

  const handleUpdateStock = (item: any) => {
    setSelectedItem(item);
    updateStockForm.reset({
      quantity: item.quantity.toString(),
      reason: '',
    });
    setShowUpdateStockModal(true);
  };

  const handleSaveStock = async (data: any) => {
    try {
      setIsUpdatingStock(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically update the stock in your database
      console.log('Updating stock:', {
        itemId: selectedItem?.id,
        ...data,
      });

      toast.success('Stock updated successfully');
      setShowUpdateStockModal(false);
    } catch (error) {
      toast.error('Failed to update stock');
      console.error(error);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const handleAddNewItem = async (data: any) => {
    try {
      setIsAddingItem(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would typically save the new item to your database
      console.log('Adding new item:', data);

      toast.success('Item added successfully');
      setShowNewItemModal(false);
    } catch (error) {
      toast.error('Failed to add item');
      console.error(error);
    } finally {
      setIsAddingItem(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage medication inventory and stock levels</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/pharmacy/inventory/history">
              <BarChart3 className="mr-2 h-4 w-4" />
              View History
            </Link>
          </Button>
          <Button onClick={() => setShowNewItemModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <h3 className="text-2xl font-bold mt-2">{inventory.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <h3 className="text-2xl font-bold mt-2">
                    {inventory.filter(item => item.status === 'Low Stock').length}
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <h3 className="text-2xl font-bold mt-2">
                  {inventory.filter(item => item.status === 'Out of Stock').length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle>Inventory List</CardTitle>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="pl-8 md:w-[300px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'In Stock'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleUpdateStock(item)}>
                        Update Stock
                      </Button>
                      <Button variant="ghost" size="sm">
                        Order
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Stock Modal */}
      <Dialog open={showUpdateStockModal} onOpenChange={setShowUpdateStockModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Update Stock Level</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowUpdateStockModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <form onSubmit={updateStockForm.handleSubmit(handleSaveStock)} className="space-y-4">
            <div className="space-y-2">
              <Label>Item Details</Label>
              <div className="text-sm">
                <p>
                  <strong>ID:</strong> {selectedItem?.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedItem?.name}
                </p>
                <p>
                  <strong>Current Quantity:</strong> {selectedItem?.quantity} {selectedItem?.unit}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">New Quantity</Label>
              <Input id="quantity" type="number" {...updateStockForm.register('quantity')} />
              {updateStockForm.formState.errors.quantity && (
                <p className="text-sm text-red-500">
                  {updateStockForm.formState.errors.quantity.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Update</Label>
              <Input
                id="reason"
                {...updateStockForm.register('reason')}
                placeholder="e.g., New stock arrival, Stock correction"
              />
              {updateStockForm.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {updateStockForm.formState.errors.reason.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpdateStockModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingStock}>
                {isUpdatingStock ? (
                  <>
                    <span className="mr-2">Updating...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  'Update Stock'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Item Modal */}
      <Dialog open={showNewItemModal} onOpenChange={setShowNewItemModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Add New Item</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowNewItemModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <form onSubmit={newItemForm.handleSubmit(handleAddNewItem)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  {...newItemForm.register('name')}
                  placeholder="e.g., Amoxicillin 500mg"
                />
                {newItemForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  {...newItemForm.register('category')}
                  placeholder="e.g., Antibiotics"
                />
                {newItemForm.formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.category.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input id="quantity" type="number" {...newItemForm.register('quantity')} />
                {newItemForm.formState.errors.quantity && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" {...newItemForm.register('unit')} placeholder="e.g., Tablets" />
                {newItemForm.formState.errors.unit && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.unit.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  {...newItemForm.register('supplier')}
                  placeholder="e.g., PharmaCorp Inc."
                />
                {newItemForm.formState.errors.supplier && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.supplier.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  {...newItemForm.register('reorderPoint')}
                  placeholder="Minimum quantity before reorder"
                />
                {newItemForm.formState.errors.reorderPoint && (
                  <p className="text-sm text-red-500">
                    {newItemForm.formState.errors.reorderPoint.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewItemModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAddingItem}>
                {isAddingItem ? (
                  <>
                    <span className="mr-2">Adding...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  'Add Item'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
