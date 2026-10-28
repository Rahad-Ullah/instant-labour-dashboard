"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClockFading, Eye, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import VerifyDetailsModal from "@/modal/VerifyDetailsModal";
import { useGetVerificationRequests } from "@/lib/query/hooks";
import { IUser, USER_ROLES } from "@/types/users";
import { useState } from "react";
import Pagination from "@/components/ui/pagination";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { UserCheck } from "lucide-react";

export default function VerifyReuest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const limit = 10;
  const { data, isLoading } = useGetVerificationRequests({
    role: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage,
    limit,
  });

  const { meta, data: users } = data || {};

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <>
      <div className="bg-[#f9f9f9] p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Verify Request</h2>
          <div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value={USER_ROLES.WORKER}>Worker</SelectItem>
                  <SelectItem value={USER_ROLES.EMPLOYER}>Employer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full max-w-[calc(100vw-330px)] overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100 text-gray-600">
                <TableHead>Serial No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pl-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    <TableCell><div className="h-4 w-6 bg-slate-200 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-28 bg-slate-200 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-36 bg-slate-200 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-slate-200 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-slate-200 rounded" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-slate-200 rounded-full" /></TableCell>
                    <TableCell className="pl-10"><div className="h-7 w-7 bg-slate-200 rounded" /></TableCell>
                  </TableRow>
                ))
              ) : !users || users.length === 0 ? (
                <EmptyTableRow
                  colSpan={7}
                  icon={UserCheck}
                  title="No Verification Requests Found"
                  description={
                    statusFilter !== "all"
                      ? `No verification requests found for the selected "${statusFilter}" role.`
                      : "There are currently no verification requests pending review."
                  }
                  action={
                    statusFilter !== "all" ? (
                      <button
                        onClick={() => handleStatusFilterChange("all")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 underline cursor-pointer"
                      >
                        Clear role filter
                      </button>
                    ) : undefined
                  }
                />
              ) : (
                users.map((user: IUser, index: number) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      {String((currentPage - 1) * limit + index + 1).padStart(2, "0")}
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      {user.name}
                    </TableCell>

                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      <Badge
                        className={`w-22 ${user.isAccountVerified
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                          } p-2`}
                      >
                        {user.isAccountVerified ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2 pl-10">
                      <VerifyDetailsModal
                        user={user}
                        trigger={
                          <span className="bg-blue-600 p-1 rounded cursor-pointer">
                            <Eye className=" text-white" />
                          </span>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={setCurrentPage}
            total={meta.total}
            limit={limit}
          />
        )}
      </div>
    </>
  );
}
