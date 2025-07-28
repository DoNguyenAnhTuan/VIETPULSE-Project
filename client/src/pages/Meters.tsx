import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaDownload, FaBolt, FaLeaf, FaMoneyBillWave, FaPlugCircleBolt } from "react-icons/fa6";
import { FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAccessToken, fetchSiteData, fetchSiteData_ConsumptionSummary } from "@/utils/API";
import { useOutletContext } from "react-router-dom";

interface MeterUsageStats {
  electricityConsumption: string;
  carbonEmissions: string;
  cost: number;
  benefits: number;
  livepowwer: string;
}

interface OutletContext {
  selectedSiteId: string;
  monthYear: Date | null;
}

interface HourlyUsageData {
  hour: string;
  usage: number;
}

const Meters = () => {
  const { selectedSiteId, monthYear } = useOutletContext<OutletContext>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [siteFilter, setSiteFilter] = useState<string>("EIU Block 6");

  // Fetch hourly usage data from API (the new way)
  const { data: hourlyData, isLoading: isHourlyDataLoading, refetch: refetchHourlyData } = useQuery<HourlyUsageData[]>({
    queryKey: ["/api/site/consumption/profile", selectedSiteId, date?.toISOString().split('T')[0]],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) return [];
      const siteId = selectedSiteId || "712";
      const today = date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      // End date is +1 day
      const endDateObj = new Date(today);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const endDate = endDateObj.toISOString().split('T')[0];
      const url = `https://admin.qenergy.ai/api/site/${siteId}/consumption/profile/${today}/${endDate}?resolution=hour`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Transform the data to match our expected format for recharts
      return data.map((item: any) => ({
        hour: item._id.slice(11, 16), // 'HH:mm' from ISO string
        usage: item.actual
      }));
    }
  });

  // Fetch live power data
  const fetchLivePower = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const siteData = await fetchSiteData(accessToken, selectedSiteId);
      if (siteData) {
        console.log("Fetching data for site:", selectedSiteId);
        return parseFloat(siteData.live_power).toFixed(2);
      }
    }
    return "0.00";
  };

  const fetchConsumptionSummary = async () => {
    const accessToken = await getAccessToken();

    if (!monthYear) {
      console.warn("monthYear is null, skipping API call");
      return { actual: "0.00", carbon_emission: "0.00" };
    }

    if (!accessToken) return { actual: "0.00", carbon_emission: "0.00" };

    const day = new Date(monthYear);
    const startDate = day.toISOString().split("T")[0];

    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const endDate = nextDay.toISOString().split("T")[0];

    const summary = await fetchSiteData_ConsumptionSummary(accessToken, selectedSiteId, startDate, endDate);

    if (summary && summary.length > 0) {
      const result = summary[0];
      return {
        actual: (result.actual ).toFixed(2), // kWh to MWh
        carbon_emission: result.carbon_emission.toFixed(2)
      };
    }

    return { actual: "0.00", carbon_emission: "0.00" };
  };


  const { data: usageStats, isLoading: isStatsLoading, refetch: refetchUsageStats } = useQuery<MeterUsageStats>({
    queryKey: ["/api/energy/summary", selectedSiteId, monthYear?.toISOString()],
    queryFn: async () => {
      const livePower = await fetchLivePower();
      const { actual, carbon_emission } = await fetchConsumptionSummary();

      return {
        electricityConsumption: actual,               // Ví dụ: "0.52" MWh
        carbonEmissions: carbon_emission,             // Ví dụ: "111.48"
        cost: parseFloat(actual) * 0.07 * 1000,        // USD
        benefits: 0,
        livepowwer: livePower                          // Ví dụ: "3.21" kW
      };
    }
  });


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  console.log("Block (siteFilter):", siteFilter, "hourlyData:", hourlyData);

  return (
    
    <div className="flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto">
      
      
      {/* Usage statistics cards - hiện đại, có icon, điểm nhấn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ô 1: Electricity Usage */}
        <Card className="bg-gradient-to-br from-[#e0f7fa] to-[#fff] shadow-lg border-0">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#008080]/20 text-[#008080]">
                  <FaBolt className="text-3xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#008080]">{usageStats?.electricityConsumption || '0'} <span className="text-lg font-semibold">MWh</span></div>
                  <div className="text-sm text-gray-500 font-semibold tracking-wide mt-1">CONSUMPTION</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#4ade80]/20 text-[#22c55e]">
                  <FaLeaf className="text-2xl" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#22c55e]">{usageStats?.carbonEmissions || 'N/A'} <span className="text-base font-semibold">kg CO2e</span></div>
                  <div className="text-xs text-gray-500 font-semibold tracking-wide">CARBON EMISSIONS</div>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <FaQuestionCircle className="ml-2 text-gray-400 text-base" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm">Carbon emissions from electricity usage</p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ô 2: My Finances */}
        <Card className="bg-gradient-to-br from-[#fffbe7] to-[#fff] shadow-lg border-0">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#facc15]/20 text-[#f59e42]">
                  <FaMoneyBillWave className="text-3xl" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#f59e42]">{formatCurrency(usageStats?.cost || 0)}</div>
                  <div className="text-sm text-gray-500 font-semibold tracking-wide mt-1">COST</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#bae6fd]/40 text-[#0ea5e9]">
                  <FaDownload className="text-2xl" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#0ea5e9]">{formatCurrency(usageStats?.benefits || 0)}</div>
                  <div className="text-xs text-gray-500 font-semibold tracking-wide">BENEFITS</div>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <FaQuestionCircle className="ml-2 text-gray-400 text-base" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm">Cost savings from energy management</p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ô 3: Live Usage Status */}
        <Card className="bg-gradient-to-br from-[#e0ffe7] to-[#fff] shadow-lg border-0">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#22c55e]/20 text-[#22c55e] animate-pulse">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#22c55e] flex items-center gap-2">Online</div>
                  <div className="text-sm text-gray-500 font-semibold tracking-wide mt-1">Status</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#008080]/20 text-[#008080]">
                  <FaPlugCircleBolt className="text-2xl" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#008080]">{usageStats?.livepowwer || '0'} <span className="text-base font-semibold">kW</span></div>
                  <div className="text-xs text-gray-500 font-semibold tracking-wide">Live Power</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage chart */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-gray-500 uppercase">ELECTRICITY USAGE</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: '#002855', borderRadius: '4px' }}></div>
                  <span className="text-xs">Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-orange-400 rounded-sm"></div>
                  <span className="text-xs">CO2 Emissions</span>
                </div>
              </div>
            </div>
            {/* Badge mô tả biểu đồ */}
            <div className="flex items-center gap-2 mt-1">
              <svg className="w-4 h-4 text-[#008080]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0v-6a2 2 0 012-2h2a2 2 0 012 2v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#e0f7fa] text-[#008080] text-xs font-semibold">Hourly Profile</span>
              <span className="text-xs text-gray-400">(kWh by hour for selected day)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hourlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
                barSize={22}
              >
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008080" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#002855" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 13, fill: '#002855', fontWeight: 500 }}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                  tickFormatter={(value) => {
                    const hour = parseInt(value.split(':')[0]);
                    if (hour % 3 === 0) {
                      return `${hour}:00`;
                    }
                    return '';
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 13, fill: '#002855', fontWeight: 500 }}
                  domain={[0, 'dataMax + 100']}
                  tickCount={5}
                  axisLine={{ stroke: '#E0E0E0' }}
                  tickLine={false}
                  tickFormatter={(value: number) => {
                    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
                    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
                    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
                    return value.toFixed(0);
                  }}
                  label={{ 
                    value: 'kWh', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 13, fill: '#008080', fontWeight: 600 } 
                  }}
                />



                <Tooltip 
                  contentStyle={{ borderRadius: 12, background: '#fff', boxShadow: '0 2px 12px 0 #00808022', border: '1px solid #e0f7fa' }}
                  itemStyle={{ color: '#008080', fontWeight: 600 }}
                  labelStyle={{ color: '#002855', fontWeight: 600 }}
                  formatter={(value) => [`${value} kWh`, 'Usage']}
                  labelFormatter={(label) => `Time: ${label}`}
                  cursor={{ fill: 'rgba(0, 128, 128, 0.08)' }}
                />
                <Bar dataKey="usage" fill="url(#usageGradient)" radius={[8, 8, 0, 0]} style={{ filter: 'drop-shadow(0 2px 8px #00808033)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Meters;