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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';

// Mock data - items that need reordering
const lowStockItems = [
  {
    id: 'MED002',
    name: 'Lisinopril 10mg',
    category: 'Cardiovascular',
    currentStock: 80,
    unit: 'Tablets',
    supplier: 'MediSupply Ltd.',
    reorderPoint: 100,
    recommendedOrder: 100,
  },
  {
    id: 'MED003',
    name: 'Metformin 850mg',
    category: 'Diabetes',
    currentStock: 0,
    unit: 'Tablets',
    supplier: 'PharmaCorp Inc.',
    reorderPoint: 100,
    recommendedOrder: 150,
  },
];

export default function OrderPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleQuantityChange = (itemId: string, quantity: string) => {
    setOrderQuantities(prev => ({
      ...prev,
      [itemId]: parseInt(quantity) || 0,
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const orderItems = selectedItems.map(itemId => {
        const item = lowStockItems.find(i => i.id === itemId);
        return {
          itemId,
          quantity: orderQuantities[itemId] || item?.recommendedOrder || 0,
        };
      });

      // Here you would typically send the order to your backend
      console.log('Placing order:', orderItems);
      
      toast.success('Order placed successfully');
      // Reset selection after successful order
      setSelectedItems([]);
      setOrderQuantities({});
    } catch (error) {
      toast.error('Failed to place order');
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalItems = selectedItems.length;
  const totalUnits = selectedItems.reduce((sum, itemId) => {
    return sum + (orderQuantities[itemId] || lowStockItems.find(i => i.id === itemId)?.recommendedOrder || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/pharmacy/inventory">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Place Order</h2>
          </div>
          <p className="text-muted-foreground">Order items that are low in stock</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <h3 className="text-2xl font-bold mt-2">{lowStockItems.length}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Selected Items</p>
              <h3 className="text-2xl font-bold mt-2">{totalItems}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              <h3 className="text-2xl font-bold mt-2">{totalUnits}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items to Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === lowStockItems.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(lowStockItems.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Order Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <span className="text-red-500">
                      {item.currentStock} {item.unit}
                    </span>
                  </TableCell>
                  <TableCell>{item.reorderPoint} {item.unit}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={orderQuantities[item.id] || item.recommendedOrder}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">{item.unit}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/pharmacy/inventory">
                Cancel
              </Link>
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={selectedItems.length === 0 || isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <span className="mr-2">Placing Order...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 