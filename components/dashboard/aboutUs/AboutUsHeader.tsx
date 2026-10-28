"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";
import AboutSection from "./aboutDropDown/AboutSection";
import WhoWeAre from "./aboutDropDown/WhoWeAre";
import Mission from "./aboutDropDown/Mission";
import WhatWeDo from "./aboutDropDown/WhatWeDo";
import OurVision from "./aboutDropDown/OurVision";
import WhyChoose from "./aboutDropDown/WhyChoose";
import EmptyState from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

const title = [
  { id: 1, value: "Hero Section" },
  { id: 2, value: "Who We Are" },
  { id: 3, value: "Our Mission" },
  { id: 4, value: "Where We Operate" },
  { id: 5, value: "Why Chose Instantlabour" },
  { id: 6, value: "Our Vision" },
];

export default function AboutUsHeader() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  return (
    <>
      <section className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-[#F6F6F6] py-5 px-6 rounded-md">
          <h2 className="text-xl font-medium text-gray-800">
            About Us Landing Page
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
              icon={FileText}
              title="No Section Selected"
              description="Choose an About Us section from the dropdown above to view, edit, or configure its content."
            />
          </div>
        )}

        {/* Modal rendered when selected */}
        {selectedValue === "Hero Section" && <AboutSection />}
        {selectedValue === "Who We Are" && <WhoWeAre />}
        {selectedValue === "Our Mission" && <Mission />}
        {selectedValue === "Where We Operate" && <WhatWeDo />}
        {selectedValue === "Why Chose Instantlabour" && <WhyChoose />}
        {selectedValue === "Our Vision" && <OurVision />}
      </section>
    </>
  );
}
