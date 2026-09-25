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
import { Eye, Link, Lock, LockOpen, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  useDeleteUser,
  useGetAllUser,
  useUpdateUserStatus,
} from "@/lib/query/hooks/dashboard/users";
import { USER_ROLES, USER_STATUS } from "@/types/users";
import { getImageUrl } from "@/utils/image";
import Pagination from "@/components/ui/pagination";

export default function AllWorker() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 10;
  const router = useRouter();

  // Fetch workers with pagination and status filter
  const { data: response, isLoading } = useGetAllUser({
    role: USER_ROLES.WORKER,
    page: currentPage,
    limit,
    ...(statusFilter !== "all" && { status: statusFilter }),
  });

  const { data, mutate: deleteUser } = useDeleteUser();

  const workers = response?.data || [];
  const meta = response?.meta;

  // Update user status mutation
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateUserStatus("");

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

  const handleStatusToggle = (workerId: string) => {
    updateStatus(workerId);
  };

  if (isLoading) {
    return (
      <div className="bg-[#f9f9f9] p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f9f9f9] p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Worker</h2>
          <div>
            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value={USER_STATUS.RESTRICTED}>Block</SelectItem>
                  <SelectItem value={USER_STATUS.ACTIVE}>Active</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full max-w-[calc(100vw-330px)] overflow-x-auto">
          <Table className="">
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
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No workers found
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker, index) => (
                  <TableRow key={worker._id}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * limit + index + 1}
                    </TableCell>

                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={getImageUrl(worker.profile)}
                        alt="name"
                        width={30}
                        height={30}
                        className=" rounded-full object-cover"
                      />
                      {worker.name}
                    </TableCell>

                    <TableCell>{worker.email}</TableCell>
                    <TableCell>{worker.phone}</TableCell>
                    <TableCell>{worker.address}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${worker.status === USER_STATUS.ACTIVE
                            ? "bg-green-500 "
                            : "bg-[#E02121]"
                          } w-20 text-white`}
                      >
                        {worker.status === USER_STATUS.ACTIVE
                          ? "Active"
                          : "Block"}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2 ml-3">
                      <span
                        className="bg-blue-600 p-1 rounded cursor-pointer"
                        onClick={() =>
                          router.push(`/worker-details/?id=${worker._id}`)
                        }
                      >
                        <Eye className=" text-white" />
                      </span>

                      <span
                        className={`bg-[#E6E6E6] p-1 rounded ${isUpdating
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                          }`}
                        onClick={() =>
                          !isUpdating && handleStatusToggle(worker._id)
                        }
                      >
                        {worker.status === USER_STATUS.ACTIVE ? (
                          <LockOpen size={24} className=" text-green-600" />
                        ) : (
                          <Lock size={24} className=" text-red-600" />
                        )}
                      </span>

                      <span
                        className="bg-red-600 p-1 rounded cursor-pointer"
                        onClick={() => handleDelete(worker._id)}
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
