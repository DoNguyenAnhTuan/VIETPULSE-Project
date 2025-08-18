import { useState } from "react";
import { FaChevronDown, FaComments, FaCalendarAlt, FaCalendarWeek, FaCalendar, FaDownload, FaEye, FaEyeSlash } from "react-icons/fa";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useDateFilter } from "@/context/DateFilterContext";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const CARBON_SECTIONS = [
  { id: "about", label: "About" },
  { id: "national", label: "National data" },
  { id: "generation", label: "Vietnam Power Sources" },
  // { id: "examples", label: "Examples" },
  { id: "regional", label: "Regional Data" }
];

interface Site {
  id: string;
  name: string;
}

interface HeaderProps {
  toggleSidebar: () => void;
  selectedSite: string;
  setSelectedSite: (site: string) => void;
  setSelectedSiteId: (id: string) => void;
  date: Date | null;
  setDate: (date: Date | null) => void;
  monthYear: Date | null;
  setMonthYear: (date: Date | null) => void;
  year: Date | null;
  setYear: (date: Date | null) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  monthYearOpen: boolean;
  setMonthYearOpen: (open: boolean) => void;
  yearOpen: boolean;
  setYearOpen: (open: boolean) => void;
}

const Header = ({ 
  toggleSidebar, 
  selectedSite, 
  setSelectedSite, 
  setSelectedSiteId,
  date,
  setDate,
  monthYear,
  setMonthYear,
  year,
  setYear,
  calendarOpen,
  setCalendarOpen,
  monthYearOpen,
  setMonthYearOpen,
  yearOpen,
  setYearOpen
}: HeaderProps) => {
  const location = useLocation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const navigate = useNavigate();
  const isCarbon = location.pathname.includes("/carbon-journey");


  // Manual site options
  const siteOptions = [
    { id: "all", name: "ALL SITES" },
    { id: "708", name: "EIU Block 5" },
    { id: "709", name: "EIU Block 4" },
    { id: "710", name: "EIU Block 8" },
    { id: "711", name: "EIU Block 10" },
    { id: "712", name: "EIU Block 11A" },
    { id: "713", name: "EIU Block 11B" },
    { id: "716", name: "EIU Block 3" },
    { id: "717", name: "EIU Block 6" },
    { id: "714", name: "EIU Garage" }
  ];

  // Helper functions for month/year options
  function generateMonthOptions() {
    const now = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), i, 1);
      months.push({ label: format(date, "MMMM - yyyy"), value: date });
    }
    return months;
  }

  function generateYearOptions(startYear: number) {
    const now = new Date();
    const years = [];
    for (let y = startYear; y <= now.getFullYear(); y++) {
      years.push(new Date(y, 0, 1));
    }
    return years;
  }

  const handleSiteSelect = (site: Site) => {
    console.log("Selected site:", {
      id: site.id,
      name: site.name,
      timestamp: new Date().toISOString()
    });
    setSelectedSite(site.name);
    setSelectedSiteId(site.id);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-[#f4f8fb] shadow z-20 border-b border-[#e6f0fa]">
      <div className="flex items-center justify-between px-6 py-3 min-h-[72px]">
        <div className="flex items-center gap-6">
          {/* Dropdown ALL SITES */}
          {!isCarbon && (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-between w-52 md:w-64 px-5 py-2 font-bold text-base uppercase bg-gradient-to-r from-[#43a047] via-[#388e3c] to-[#0B3D61] text-white rounded-full shadow-md hover:from-[#388e3c] hover:to-[#008080] transition-all duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:ring-offset-2">
                    <span className="truncate max-w-[120px] md:max-w-[180px] tracking-wide">{selectedSite}</span>
                    <FaChevronDown className="ml-2 h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 md:w-64 rounded-2xl shadow-lg border border-[#e6f0fa] bg-white py-2">
                  {siteOptions.map((site) => (
                    <DropdownMenuItem
                      key={site.id}
                      onClick={() => handleSiteSelect(site)}
                      className="cursor-pointer hover:bg-[#e6fbe6] px-4 py-2 rounded-lg font-semibold text-base transition-all"
                    >
                      {site.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}


          {/* Navigation buttons - Only show on CarbonJourney page */}
          {isCarbon && (
            <div className="flex items-center gap-2">
              {CARBON_SECTIONS.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="hover:text-[#0B3D61] font-semibold text-base px-3 py-2 rounded-lg transition-all"
                  style={{ color: '#002855' }}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </Button>
              ))}
            </div>
          )}

          {/* Date Filters - Chỉ hiển thị khi ở trang /meters */}
          {(location.pathname.startsWith("/meters") || location.pathname.startsWith("/billing-report")) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#e6f0fa] bg-[#f8fbfd] shadow-sm">
              {/* Date Popover: chỉ hiện ở /meters */}
              {location.pathname.startsWith("/meters") && (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 font-medium text-base border-[#d1e3f8] hover:bg-[#e6f0fa]">
                      <FaCalendarAlt className="text-[#0B3D61]" />
                      {date ? format(date, "yyyy-MM-dd") : "Select date"}
                      <span className="text-xs ml-2">Custom</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date || undefined}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              {/* Month Popover: luôn hiện */}
              <Popover open={monthYearOpen} onOpenChange={setMonthYearOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 font-medium text-base border-[#d1e3f8] hover:bg-[#e6f0fa]">
                    <FaCalendarWeek className="text-[#0B3D61]" />
                    {monthYear ? format(monthYear, "MMMM - yyyy") : "Select month"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-48">
                  <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
                    {generateMonthOptions().map((option) => (
                      <button
                        key={option.label}
                        onClick={() => {
                          setMonthYear(option.value);
                          setMonthYearOpen(false);
                        }}
                        className={`text-left px-3 py-2 rounded hover:bg-gray-100 ${
                          monthYear && format(option.value, "MMMM-yyyy") === format(monthYear, "MMMM-yyyy")
                            ? "text-purple-600 font-bold"
                            : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Year Popover: luôn hiện */}
              <Popover open={yearOpen} onOpenChange={setYearOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 font-medium text-base border-[#d1e3f8] hover:bg-[#e6f0fa]">
                    <FaCalendar className="text-[#0B3D61]" />
                    {year ? format(year, "yyyy") : "Select year"}
                    <span className="text-xs ml-2">Year</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-32">
                  <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
                    {generateYearOptions(2023).map((option) => (
                      <button
                        key={option.getFullYear()}
                        onClick={() => {
                          setYear(option);
                          setYearOpen(false);
                        }}
                        className={`text-center px-3 py-2 rounded hover:bg-gray-100 ${
                          year && option.getFullYear() === year.getFullYear()
                            ? "text-purple-600 font-bold"
                            : ""
                        }`}
                      >
                        {option.getFullYear()}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Right side: Download button and user menu */}
        <div className="flex items-center gap-5">
          <Button variant="outline" className="flex items-center gap-2 font-semibold text-base bg-white hover:bg-[#e6f0fa] text-[#0B3D61] shadow-sm px-5 py-2 rounded-xl transition-all border-0">
            <FaDownload className="text-[#0B3D61]" />
            Download
          </Button>
          <button className="text-[#0B3D61] p-2 rounded-full hover:bg-[#e6f0fa] focus:outline-none transition-all shadow-sm">
            <FaComments className="h-5 w-5" />
          </button>
          <div className="relative">
            <button 
              className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-[#fbbf24] to-[#f59e42] text-white rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform duration-150"
              onClick={() => navigate("/profile")}
            >
              <span className="font-bold text-base">AT</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
