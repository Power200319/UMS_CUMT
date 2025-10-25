import { useState, useEffect } from "react";
import { FileText, Calendar, DollarSign, Clock, Eye, Download, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockLecturerContracts } from "@/api/mockData";
import { useResponsive } from "@/hooks/useResponsive";
import type { User } from "@/types";

type ContractStatus = "active" | "completed" | "terminated" | "pending";

interface Contract {
  id: string;
  lecturerId: string;
  lecturer: User;
  contractType: string;
  position: string;
  department: string;
  startDate: string;
  endDate: string;
  salary: number;
  currency: string;
  workingHours: number;
  status: ContractStatus;
  terms: string;
  signedDate: string;
  renewalEligible: boolean;
  performanceRating?: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeacherContracts() {
  const { isMobile, isTablet } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContracts(mockLecturerContracts as Contract[]);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "terminated":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "terminated":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading contracts..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teaching Contracts"
        description="View and manage your teaching contracts and agreements"
        aria-label="Teaching contracts page header"
      />

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {contracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-lg transition-all duration-300 border-blue-100 hover:border-blue-200 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {contract.contractType} Contract
                  </CardTitle>
                  <p className="text-sm text-blue-600">{contract.position}</p>
                </div>
                <Badge className={`${getStatusColor(contract.status)} flex items-center gap-1`}>
                  {getStatusIcon(contract.status)}
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className={`grid gap-4 text-sm ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Start Date</p>
                    <p className="text-blue-600">{new Date(contract.startDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">End Date</p>
                    <p className="text-blue-600">{new Date(contract.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Salary</p>
                    <p className="text-blue-600">{formatCurrency(contract.salary, contract.currency)}/year</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-900">Working Hours</p>
                    <p className="text-blue-600">{contract.workingHours} hrs/week</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium text-blue-900">Department</p>
                <p className="text-blue-600">{contract.department}</p>
              </div>

              {contract.performanceRating && (
                <div className="space-y-2">
                  <p className="font-medium text-blue-900">Performance Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${star <= contract.performanceRating! ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-blue-600">{contract.performanceRating}/5</span>
                  </div>
                </div>
              )}

              <div className={`flex gap-2 pt-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 hover:bg-blue-50"
                      onClick={() => setSelectedContract(contract)}
                      aria-label={`View details for ${contract.contractType} contract`}
                    >
                      <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-blue-900">Contract Details</DialogTitle>
                    </DialogHeader>
                    {selectedContract && (
                      <div className="space-y-6">
                        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-2">Contract Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Type:</span> {selectedContract.contractType}</p>
                              <p><span className="font-medium">Position:</span> {selectedContract.position}</p>
                              <p><span className="font-medium">Department:</span> {selectedContract.department}</p>
                              <p><span className="font-medium">Status:</span> {selectedContract.status}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-900 mb-2">Terms & Conditions</h4>
                            <p className="text-sm text-blue-600">{selectedContract.terms}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-2">Duration</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Start Date:</span> {new Date(selectedContract.startDate).toLocaleDateString()}</p>
                              <p><span className="font-medium">End Date:</span> {new Date(selectedContract.endDate).toLocaleDateString()}</p>
                              <p><span className="font-medium">Signed Date:</span> {new Date(selectedContract.signedDate).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-blue-900 mb-2">Compensation</h4>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium">Salary:</span> {formatCurrency(selectedContract.salary, selectedContract.currency)}/year</p>
                              <p><span className="font-medium">Working Hours:</span> {selectedContract.workingHours} hrs/week</p>
                              <p><span className="font-medium">Renewal Eligible:</span> {selectedContract.renewalEligible ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>

                        {selectedContract.performanceRating && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-2">Performance</h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-lg ${star <= selectedContract.performanceRating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-blue-600">{selectedContract.performanceRating}/5</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 hover:bg-blue-50"
                  aria-label={`Download ${contract.contractType} contract`}
                >
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No Contracts Found</h3>
          <p className="text-blue-600">You don't have any teaching contracts at the moment.</p>
        </div>
      )}
    </div>
  );
}