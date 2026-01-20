import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, CheckCircle2, Circle, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProcedureStep {
  title: string;
  completed?: boolean;
}

interface ProcedureItem {
  id: string;
  title: string;
  description: string;
  department: string;
  steps: ProcedureStep[];
  lastUpdated: string;
}

const procedures: ProcedureItem[] = [
  {
    id: "1",
    title: "Customer Onboarding Process",
    description: "Standard process for onboarding new customers to our platform",
    department: "Sales",
    steps: [
      { title: "Initial contact and qualification", completed: true },
      { title: "Product demonstration", completed: true },
      { title: "Contract negotiation", completed: false },
      { title: "Account setup", completed: false },
      { title: "Training session", completed: false },
    ],
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "IT Support Ticket Resolution",
    description: "How to properly handle and resolve IT support tickets",
    department: "IT",
    steps: [
      { title: "Ticket acknowledgment" },
      { title: "Issue diagnosis" },
      { title: "Solution implementation" },
      { title: "User verification" },
      { title: "Ticket closure" },
    ],
    lastUpdated: "1 week ago",
  },
  {
    id: "3",
    title: "Employee Leave Request",
    description: "Process for submitting and approving leave requests",
    department: "HR",
    steps: [
      { title: "Submit request in system" },
      { title: "Manager approval" },
      { title: "HR review" },
      { title: "Calendar update" },
    ],
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    title: "Expense Reimbursement",
    description: "Guidelines for submitting expense reports and getting reimbursed",
    department: "Finance",
    steps: [
      { title: "Collect receipts" },
      { title: "Fill expense form" },
      { title: "Submit for approval" },
      { title: "Finance processing" },
      { title: "Reimbursement" },
    ],
    lastUpdated: "5 days ago",
  },
];

const Procedures = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProcedures = procedures.filter(
    (procedure) =>
      procedure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Procedures</h1>
          <p className="text-muted">Standard operating procedures and workflows</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Procedures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProcedures.map((procedure) => {
            const completedSteps = procedure.steps.filter((s) => s.completed).length;
            const progress = (completedSteps / procedure.steps.length) * 100;

            return (
              <Card
                key={procedure.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {procedure.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {procedure.department}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted mb-4">{procedure.description}</p>

                  {/* Steps preview */}
                  <div className="space-y-2 mb-4">
                    {procedure.steps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-chart-1 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted shrink-0" />
                        )}
                        <span className={step.completed ? "text-muted line-through" : "text-card-foreground"}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                    {procedure.steps.length > 3 && (
                      <span className="text-xs text-primary ml-6">
                        +{procedure.steps.length - 3} more steps
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border">
                    <span>{procedure.steps.length} steps</span>
                    <span>Updated {procedure.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProcedures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No procedures found matching your search.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Procedures;
