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

import Swal from "sweetalert2";
import VerifyDetailsModal from "@/modal/VerifyDetailsModal";
import { useGetAllUser } from "@/lib/query/hooks";
import { IUser, USER_ROLES } from "@/types/users";
import { useDeleteUser } from "@/lib/query/hooks/dashboard/users";
import { useState } from "react";
import Pagination from "@/components/ui/pagination";

export default function VerifyReuest() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const limit = 10;
  const { data, isLoading } = useGetAllUser({
    role: statusFilter === "all" ? undefined : statusFilter,
    page: currentPage,
    limit,
  });

  const { meta, data: users } = data || {};

  const { mutate: deleteUser } = useDeleteUser();

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to be delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(
          { _id: id },
          {
            onSuccess: () => {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            },
          },
        );
      }
    });
  };

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
              {users &&
                users.map((user: IUser, index: number) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">0{index + 1}</TableCell>

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

                      <span
                        className="bg-red-600 p-1 rounded cursor-pointer"
                        onClick={() => handleDelete(user?._id)}
                      >
                        <Trash2 className=" text-white" />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
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
