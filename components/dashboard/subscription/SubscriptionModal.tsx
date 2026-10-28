"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IPackage } from "@/types/others";
import { getErrorMessage } from "@/lib/api-utils";
import {
  useCreatePackage,
  useUpdatePackage,
} from "@/lib/query/hooks/dashboard/package";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function SubscriptionModal({
  trigger,
  header,
  packageData,
}: {
  trigger: React.ReactNode;
  header?: string;
  packageData?: IPackage;
}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IPackage>>({
    type: "",
    regularPrice: 0,
    description: "",
    isInstantBooking: false,
    interval: "month",
    limits: {
      jobPostLimit: 0,
      bookingLimit: 0,
      boostLimit: 0,
    },
    features: [],
  });
  const [featureInput, setFeatureInput] = useState("");

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage(packageData?._id || "");

  // Initialize form data when packageData changes
  useEffect(() => {
    setErrorMessage(null);
    if (packageData) {
      setFormData({
        type: packageData.type,
        regularPrice: packageData.regularPrice,
        description: packageData.description || "",
        isInstantBooking: packageData.isInstantBooking || false,
        interval: packageData.interval || "month",
        limits: {
          jobPostLimit: packageData.limits?.jobPostLimit || 0,
          bookingLimit: packageData.limits?.bookingLimit || 0,
          boostLimit: packageData.limits?.boostLimit || 0,
        },
        features: packageData.features || [],
      });
    } else {
      // Reset form for create mode
      setFormData({
        type: "",
        regularPrice: 0,
        description: "",
        isInstantBooking: false,
        interval: "month",
        limits: {
          jobPostLimit: 0,
          bookingLimit: 0,
          boostLimit: 0,
        },
        features: [],
      });
    }
  }, [packageData, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLimitChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      limits: {
        ...prev.limits!,
        [field]: value,
      },
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  const scrollToTop = () => {
    const container = document.getElementById("subscription-modal-scroll-area");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.type?.trim()) {
      setErrorMessage("Please enter a package type name.");
      scrollToTop();
      return;
    }

    if (
      formData.regularPrice === undefined ||
      formData.regularPrice === null ||
      Number(formData.regularPrice) < 0 ||
      isNaN(Number(formData.regularPrice))
    ) {
      setErrorMessage("Please enter a valid regular price (0 or greater).");
      scrollToTop();
      return;
    }

    // Prepare data according to server schema
    const submitData: any = {
      type: formData.type.trim(),
      regularPrice: Number(formData.regularPrice),
      description: formData.description,
      isInstantBooking: formData.isInstantBooking,
      interval: formData.interval,
      limits: formData.limits,
      features: formData.features,
    };

    try {
      if (packageData?._id) {
        // Update mode
        await updatePackage.mutateAsync(submitData);
      } else {
        // Create mode
        await createPackage.mutateAsync(submitData);
      }
      // Only close modal on success
      setOpen(false);
      setErrorMessage(null);
    } catch (error: any) {
      // Modal stays open so user can see the error and try again
      console.error("Failed to submit package:", error);
      const message =
        getErrorMessage(error) ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit package. Please check the form and try again.";
      setErrorMessage(message);
      scrollToTop();
    }
  };

  const isUnlimited = (value: number | undefined) => value === -1;
  const toggleUnlimited = (field: string, currentValue: number | undefined) => {
    handleLimitChange(field, isUnlimited(currentValue) ? 0 : -1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setErrorMessage(null);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        id="subscription-modal-scroll-area"
        className="sm:max-w-3xl bg-white rounded-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-4">
            {packageData ? "Edit Package" : header || "Add Package"}
          </DialogTitle>
        </DialogHeader>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-in fade-in-50 duration-200"
          >
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-900">
                {packageData ? "Failed to update package" : "Failed to create package"}
              </p>
              <p className="mt-1 text-red-700 leading-relaxed break-words">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="text-red-400 hover:text-red-700 p-1 rounded-md transition-colors shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <Label htmlFor="type">Package Type *</Label>
            <Input
              id="type"
              placeholder="e.g., Basic, Premium, Enterprise"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              required
            />
          </div>

          {/* Regular Price */}
          <div>
            <Label htmlFor="regularPrice">Regular Price *</Label>
            <Input
              id="regularPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.regularPrice}
              onChange={(e) =>
                handleInputChange("regularPrice", parseFloat(e.target.value))
              }
              required
            />
          </div>
          {/* <div>
            <Label htmlFor="regularPrice">Discount</Label>
            <Input
              id="regularPrice"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.regularPrice}
              onChange={(e) =>
                handleInputChange("regularPrice", parseFloat(e.target.value))
              }
              required
            />
          </div> */}

          {/* Interval */}
          <div>
            <Label htmlFor="interval">Billing Interval</Label>
            <select
              id="interval"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.interval}
              onChange={(e) =>
                handleInputChange(
                  "interval",
                  e.target.value as "month" | "year",
                )
              }
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Package description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Instant Booking */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isInstantBooking"
              checked={formData.isInstantBooking}
              onCheckedChange={(checked) =>
                handleInputChange("isInstantBooking", checked)
              }
            />
            <Label htmlFor="isInstantBooking" className="cursor-pointer">
              Enable Instant Booking
            </Label>
          </div>

          {/* Limits Section */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">Package Limits</h3>

            {/* Job Post Limit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="jobPostLimit">Job Post Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isJobPostLimitUnlimited"
                    checked={isUnlimited(formData.limits?.jobPostLimit)}
                    onCheckedChange={() =>
                      toggleUnlimited(
                        "jobPostLimit",
                        formData.limits?.jobPostLimit,
                      )
                    }
                  />
                  <Label
                    htmlFor="isJobPostLimitUnlimited"
                    className="cursor-pointer text-sm"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                id="jobPostLimit"
                type="number"
                min="0"
                placeholder="0"
                value={
                  isUnlimited(formData.limits?.jobPostLimit)
                    ? ""
                    : formData.limits?.jobPostLimit
                }
                onChange={(e) =>
                  handleLimitChange(
                    "jobPostLimit",
                    parseInt(e.target.value) || 0,
                  )
                }
                disabled={isUnlimited(formData.limits?.jobPostLimit)}
              />
            </div>

            {/* Booking Limit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="bookingLimit">Booking Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBookingLimitUnlimited"
                    checked={isUnlimited(formData.limits?.bookingLimit)}
                    onCheckedChange={() =>
                      toggleUnlimited(
                        "bookingLimit",
                        formData.limits?.bookingLimit,
                      )
                    }
                  />
                  <Label
                    htmlFor="isBookingLimitUnlimited"
                    className="cursor-pointer text-sm"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                id="bookingLimit"
                type="number"
                min="0"
                placeholder="0"
                value={
                  isUnlimited(formData.limits?.bookingLimit)
                    ? ""
                    : formData.limits?.bookingLimit
                }
                onChange={(e) =>
                  handleLimitChange(
                    "bookingLimit",
                    parseInt(e.target.value) || 0,
                  )
                }
                disabled={isUnlimited(formData.limits?.bookingLimit)}
              />
            </div>

            {/* Boost Limit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="boostLimit">Boost Limit</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBoostLimitUnlimited"
                    checked={isUnlimited(formData.limits?.boostLimit)}
                    onCheckedChange={() =>
                      toggleUnlimited("boostLimit", formData.limits?.boostLimit)
                    }
                  />
                  <Label
                    htmlFor="isBoostLimitUnlimited"
                    className="cursor-pointer text-sm"
                  >
                    Unlimited
                  </Label>
                </div>
              </div>
              <Input
                id="boostLimit"
                type="number"
                min="0"
                placeholder="0"
                value={
                  isUnlimited(formData.limits?.boostLimit)
                    ? ""
                    : formData.limits?.boostLimit
                }
                onChange={(e) =>
                  handleLimitChange("boostLimit", parseInt(e.target.value) || 0)
                }
                disabled={isUnlimited(formData.limits?.boostLimit)}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="features">Features</Label>
            </div>
            <div className="flex gap-2 mb-2">
              <Input
                id="featureInput"
                placeholder="Add a feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className=""
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                className="bg-[#0057DC] px-4 shrink-0 w-[10%] h-11"
                size="default"
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.features?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom error indicator if scrolled down */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="truncate flex-1 font-medium">{errorMessage}</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="text-xs text-red-600 hover:text-red-800 underline shrink-0 cursor-pointer"
              >
                View details
              </button>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#FFC823] hover:bg-[#e6b51f] text-black text-lg font-semibold rounded-md py-6 cursor-pointer"
            disabled={createPackage.isPending || updatePackage.isPending}
          >
            {createPackage.isPending || updatePackage.isPending
              ? "Submitting..."
              : packageData
                ? "Update Package"
                : "Create Package"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
