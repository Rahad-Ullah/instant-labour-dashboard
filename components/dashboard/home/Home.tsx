"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useEffect, useState } from "react";
import HeroSection from "./selectPage/HeroSection";
import Labour from "./selectPage/Labour";

import HowWorker from "./selectPage/HowWorker";
import HowWorkEmployee from "./selectPage/HowWorkEmployee";
import JobResponses from "./selectPage/JobResponses";
import OurClients from "../ourClients/OurClients";
import EmptyState from "@/components/ui/empty-state";
import { LayoutTemplate } from "lucide-react";

const title = [
  { id: 1, value: "Hero Section" },
  { id: 2, value: "How it work(employer)" },
  { id: 3, value: "How it work(worker)" },
  { id: 4, value: "Why instant labour" },
  { id: 5, value: "Job Responses" },
  { id: 6, value: "Client Say" },
];

export default function Home() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isHeroOpen, setIsHeroOpen] = useState(false);

  // Open dialog automatically when Hero Section is selected
  useEffect(() => {
    if (selectedValue === "Hero Section") {
      setIsHeroOpen(true);
    } else if (selectedValue === "How it work(employer)") {
      setIsHeroOpen(true);
    } else if (selectedValue === "How it work(worker)") {
      setIsHeroOpen(true);
    } else if (selectedValue === "Why instant labour") {
      setIsHeroOpen(true);
    } else if (selectedValue === "Job Responses") {
      setIsHeroOpen(true);
    } else if (selectedValue === "Client Say") {
      setIsHeroOpen(true);
    }
  }, [selectedValue]);
  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[#F6F6F6] py-5 px-6 rounded-md">
        <h2 className="text-xl md:text-2xl font-medium text-gray-800">
          Landing Page Content Manager
        </h2>

        <div className="flex items-center space-x-5 min-w-[240px]">
          <Select
            onValueChange={(value) => setSelectedValue(value)}
            value={selectedValue}
          >
            <SelectTrigger className="w-full cursor-pointer bg-white">
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {title.map((item) => (
                  <SelectItem key={item.id} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* When no section is selected */}
      {!selectedValue && (
        <div className="mt-8">
          <EmptyState
            variant="dashed"
            icon={LayoutTemplate}
            title="No Section Selected"
            description="Choose a landing page section from the dropdown above to view, create, or customize its content."
          />
        </div>
      )}

      {/* Modal rendered when selected */}
      {selectedValue === "Hero Section" && <HeroSection />}
      {selectedValue === "How it work(employer)" && <HowWorkEmployee />}
      {selectedValue === "How it work(worker)" && <HowWorker />}
      {selectedValue === "Why instant labour" && <Labour />}
      {selectedValue === "Job Responses" && <JobResponses />}
      {selectedValue === "Client Say" && <OurClients />}
    </section>
  );
}
