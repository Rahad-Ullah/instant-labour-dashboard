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
import { Eye, Lock, LockOpen, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserDetails from "@/modal/EmployeDetails";
import Image from "next/image";
import { useState } from "react";
import { useGetAllUser, useUpdateUserStatus } from "@/lib/query/hooks";
import { USER_ROLES, USER_STATUS } from "@/types/users";
import { getImageUrl } from "@/utils/image";
import { formatSubscriptionDate, getSubscriptionPlanName } from "@/utils/subscription";
import Pagination from "@/components/ui/pagination";
import Swal from "sweetalert2";
import { useDeleteUser } from "@/lib/query/hooks/dashboard/users";

export default function AllEmployeList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const limit = 10;

  // Fetch employers with pagination and status filter
  const { data: response, isLoading } = useGetAllUser({
    role: USER_ROLES.EMPLOYER,
    page: currentPage,
    limit,
    ...(statusFilter !== "all" && { status: statusFilter }),
  });
  console.log('=========>', response)

  const { data, mutate: deleteUser } = useDeleteUser();

  const employers = response?.data || [];
  const meta = response?.meta;

  // Update user status mutation
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateUserStatus("");

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusToggle = (employerId: string, currentStatus: string) => {
    const isBlocking = currentStatus === USER_STATUS.ACTIVE;
    const action = isBlocking ? "block" : "unblock";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this employer?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocking ? "#d33" : "#3085d6",
      cancelButtonColor: isBlocking ? "#3085d6" : "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(employerId, {
          onSuccess: () => {
            Swal.fire({
              title: isBlocking ? "Blocked!" : "Unblocked!",
              text: `Employer has been ${isBlocking ? "blocked" : "unblocked"} successfully.`,
              icon: "success",
            });
          },
          onError: (error: any) => {
            Swal.fire({
              title: "Error!",
              text:
                error?.response?.data?.message ||
                `Failed to ${action} employer.`,
              icon: "error",
            });
          },
        });
      }
    });
  };
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
      <div className="bg-[#f9f9f9] p-6 rounded-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Employer</h2>
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
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pl-8">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    No employers found
                  </TableCell>
                </TableRow>
              ) : (
                employers.map((employer, index) => {
                  const isSubActive = Boolean(
                    employer.subscription?.isActive ||
                      employer.subscription?.status === "active"
                  );
                  const planName = getSubscriptionPlanName(employer.subscription);

                  return (
                    <TableRow key={employer._id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * limit + index + 1}
                      </TableCell>

                      <TableCell className="flex items-center gap-2">
                        <Image
                          src={getImageUrl(employer.profile)}
                          alt="name"
                          width={30}
                          height={30}
                          className=" rounded-full object-cover h-12 w-12"
                          sizes="100vh"
                        />
                        {employer.name}
                      </TableCell>

                      <TableCell>{employer.email}</TableCell>
                      <TableCell>{employer.phone}</TableCell>
                      <TableCell>{employer.address as string}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {isSubActive ? (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {planName || "Active Plan"}
                            </span>
                            {employer.subscription?.currentPeriodEnd && (
                              <span className="text-[11px] text-gray-500 pl-0.5">
                                Exp:{" "}
                                {formatSubscriptionDate(
                                  employer.subscription.currentPeriodEnd
                                )}
                              </span>
                            )}
                          </div>
                        ) : planName || employer.subscription?.status ? (
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              {planName || "Plan"}
                            </span>
                            <span className="text-[10px] text-amber-600 pl-0.5 capitalize">
                              {employer.subscription?.status || "Inactive"}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal bg-gray-100 text-gray-500 border border-gray-200">
                            No Plan
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            employer.status === USER_STATUS.ACTIVE
                              ? "bg-green-500 "
                              : "bg-[#E02121]"
                          } w-20 text-white`}
                        >
                          {employer.status === USER_STATUS.ACTIVE
                            ? "Active"
                            : "Block"}
                        </Badge>
                      </TableCell>
                    <TableCell className="">
                      <div className="flex items-center gap-2">
                        <UserDetails
                          user={employer}
                          trigger={
                            <span className="bg-blue-600 p-1 rounded cursor-pointer">
                              <Eye className=" text-white" />
                            </span>
                          }
                        />

                        <span
                          className={`bg-[#E6E6E6] p-1 rounded ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          title={
                            employer.status === USER_STATUS.ACTIVE
                              ? "Block employer"
                              : "Unblock employer"
                          }
                          onClick={() =>
                            !isUpdating &&
                            handleStatusToggle(employer._id, employer.status)
                          }
                        >
                          {employer.status === USER_STATUS.ACTIVE ? (
                            <LockOpen size={24} className=" text-green-600" />
                          ) : (
                            <Lock size={24} className=" text-red-600" />
                          )}
                        </span>
                        <span
                          className="bg-red-600 p-1 rounded cursor-pointer"
                          onClick={() => handleDelete(employer._id)}
                        >
                          <Trash2 className=" text-white" />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
