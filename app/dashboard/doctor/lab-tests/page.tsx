'use client';

import { useState } from 'react';
import { Beaker, Search, Plus, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock data
const labTests = [
  {
    id: 1,
    patient: 'John Doe',
    testType: 'Complete Blood Count',
    orderedDate: '2024-02-15',
    status: 'Completed',
    results: 'Normal',
    priority: 'Routine',
  },
  {
    id: 2,
    patient: 'Jane Smith',
    testType: 'Lipid Panel',
    orderedDate: '2024-02-10',
    status: 'Pending',
    priority: 'Urgent',
  },
  {
    id: 3,
    patient: 'Mike Johnson',
    testType: 'Thyroid Function',
    orderedDate: '2024-02-01',
    status: 'In Progress',
    priority: 'Routine',
  },
];

export default function LabTestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = labTests.filter(test => {
    const matchesSearch = test.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && test.status === 'Pending') ||
                      (activeTab === 'completed' && test.status === 'Completed');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lab Tests</h2>
          <p className="text-muted-foreground">Manage and track laboratory test orders</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lab-tests/new">
            <Plus className="mr-2 h-4 w-4" />
            Order New Test
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tests..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredTests.map((test) => (
            <Card key={test.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <Beaker className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{test.patient}</p>
                      <div className="text-sm text-muted-foreground">
                        {test.testType}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="mr-1 h-4 w-4" />
                        Ordered: {test.orderedDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.priority === 'Urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {test.priority}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        test.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : test.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {test.status}
                    </span>
                    {test.status === 'Completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        View Results
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {/* Content will be filtered by the map function above */}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {/* Content will be filtered by the map function above */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 