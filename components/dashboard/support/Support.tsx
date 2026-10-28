"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

import { DialogDemo } from "./Message";
import Swal from "sweetalert2";
import {
  useDeleteSupportMessage,
  useGetSupportMessage,
} from "@/lib/query/hooks/dashboard/public";
import { IContact } from "@/types/others";
import { useState } from "react";
import { USER_ROLES } from "@/types/users";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";

export default function Support() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const { data: supportMessages, isLoading } = useGetSupportMessage({
    role: roleFilter === "all" ? undefined : roleFilter,
    page: currentPage,
    limit,
  });

  const { mutate: deleteMessageMutation } = useDeleteSupportMessage();

  const handleClick = (id: string) => {
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
        deleteMessageMutation(id);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleStatusFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <>
      <div className="bg-[#f9f9f9] p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Support</h2>
        </div>
        <div className="w-full max-w-[calc(100vw-330px)] overflow-x-auto">
          <Table className="">
            <TableHeader>
              <TableRow className="bg-blue-100 text-gray-600">
                <TableHead>Serial No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
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
                    <TableCell><div className="h-6 w-20 bg-slate-200 rounded-full" /></TableCell>
                    <TableCell><div className="h-7 w-16 bg-slate-200 rounded" /></TableCell>
                  </TableRow>
                ))
              ) : !supportMessages || supportMessages.length === 0 ? (
                <EmptyTableRow
                  colSpan={6}
                  icon={Inbox}
                  title="No Support Messages Found"
                  description="There are currently no customer inquiries or support tickets submitted."
                />
              ) : (
                supportMessages.map((message: IContact, index: number) => (
                  <TableRow key={message._id}>
                    <TableCell className="font-medium">
                      {String((currentPage - 1) * limit + index + 1).padStart(2, "0")}
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      {message.name}
                    </TableCell>

                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          message.isSolved
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {message.isSolved ? "Solved" : "Unresolved"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <DialogDemo message={message} />
                      <span
                        className="bg-red-600 p-1 rounded cursor-pointer"
                        onClick={() => handleClick(message._id!)}
                      >
                        <Trash2 className=" text-white" />
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
