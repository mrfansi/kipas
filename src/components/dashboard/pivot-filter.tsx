"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function PivotFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 bg-card/50 backdrop-blur-sm border border-border/40 rounded-xl mb-4 w-fit">
      <div className="flex items-center gap-2 px-3 py-1.5 border-r border-border/40">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">The Pivot</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size="sm"
            className={cn(
              "justify-start text-left font-normal h-8",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="h-4 w-[1px] bg-border/40 mx-1" />

      <Select value={currentCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="h-8 w-[140px] border-0 bg-transparent focus:ring-0">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
