import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaBolt, FaFire, FaHandHoldingUsd } from "react-icons/fa";
import { getAccessToken } from "@/utils/API";
// @ts-ignore
import { fetchCostConsumptionSummary } from "@/services/API";

interface EnergyPerformanceCardProps {
  selectedSite: string;
}

interface CostConsumptionSummary {
  total_asset_financial_benefit: number | null;
  total_flex_amount: number | null;
  total_cost: number;
  total_consumption: number;
  total_gas_cost: number | null;
  total_gas_consumption: number | null;
}

declare global {
  interface Window {
    energyTotalConsumptionMWh?: string;
  }
}

const EnergyPerformanceCard = ({ selectedSite }: EnergyPerformanceCardProps) => {
  const [activeTab, setActiveTab] = useState("cost");

  const { data, isLoading } = useQuery<CostConsumptionSummary | null>({
    queryKey: ["costConsumptionSummary"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        return await fetchCostConsumptionSummary(accessToken);
      }
      return null;
    },
  });

  // Set global value for CarbonJourney
  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      window.energyTotalConsumptionMWh = (data.total_consumption / 1000).toFixed(2);
    }
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg bg-white">
      <CardHeader className="p-5 border-b border-[#f4f8fb] flex flex-row items-center justify-between bg-gradient-to-r from-[#f8fbfd] to-[#e6f0fa]">
        <div>
          <CardTitle className="text-xl font-bold text-[#0B3D61] tracking-wide">Your Energy Performance</CardTitle>
        </div>
        <a
          href="#"
          className="px-5 py-2 rounded-full font-bold text-white text-sm uppercase shadow-md bg-gradient-to-r from-[#43a047] via-[#388e3c] to-[#0B3D61] transition-all duration-200 hover:from-[#388e3c] hover:to-[#008080] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:ring-offset-2"
        >
          View More
        </a>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-[#f8fbfd] rounded-xl mt-4 mb-2">
          <TabsTrigger 
            value="cost" 
            className={
              `text-lg font-bold tracking-wide uppercase py-3 transition-all
              data-[state=active]:bg-white data-[state=active]:text-[#0B3D61] data-[state=active]:border-b-4 data-[state=active]:border-[#0B3D61]
              data-[state=inactive]:text-gray-400`
            }
          >
            Cost
          </TabsTrigger>
          <TabsTrigger 
            value="consumption" 
            className={
              `text-lg font-bold tracking-wide uppercase py-3 transition-all
              data-[state=active]:bg-white data-[state=active]:text-[#0B3D61] data-[state=active]:border-b-4 data-[state=active]:border-[#0B3D61]
              data-[state=inactive]:text-gray-400`
            }
          >
            Consumption
          </TabsTrigger>
        </TabsList>
        <TabsContent value="cost" className="p-6 space-y-5">
          {isLoading ? (
            <div className="space-y-5">
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          ) : (
            <>
              {/* Electricity Cost */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#e6fbe6] to-[#f8fafc] shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#0B3D61]">
                    {formatCurrency(data?.total_cost || 0)}
                  </h3>
                  <p className="text-sm text-gray-500">Estimated Electricity Cost</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaBolt className="text-yellow-500 text-3xl" />
                </div>
              </div>
              {/* Gas Cost */}
              {/* <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#f8fbfd] shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#B38E5D]">
                    {formatCurrency(data?.total_gas_cost || 0)}
                  </h3>
                  <p className="text-sm text-gray-500">Estimated Gas Cost</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaFire className="text-orange-500 text-3xl" />
                </div>
              </div> */}
              {/* Benefits */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#fff7e6] to-[#f8fafc] shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#b38e5d]">
                    {formatCurrency(data?.total_asset_financial_benefit || 0)}
                  </h3>
                  <p className="text-sm text-gray-500">Benefits Gained from Smart Energy Management</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaHandHoldingUsd className="text-[#b38e5d] text-3xl" />
                </div>
              </div>
            </>
          )}
        </TabsContent>
        <TabsContent value="consumption" className="p-6 space-y-5">
          {isLoading ? (
            <div className="space-y-5">
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
              <div className="h-16 bg-gray-100 animate-pulse rounded-xl"></div>
            </div>
          ) : (
            <>
              {/* Electricity Consumption */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#e6fbe6] to-[#f8fafc] shadow-sm">
                <div>
                  <h3 className="text-2xl font-extrabold text-[#388e3c]">
                    {data?.total_consumption ? `${(data.total_consumption / 1000).toFixed(2)} MWh` : '0 MWh'}
                  </h3>
                  <p className="text-sm text-gray-500">Electricity Consumption</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaBolt className="text-yellow-500 text-3xl" />
                </div>
              </div>
              {/* Gas Consumption */}
              {/* <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#f8fbfd] shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#B38E5D]">
                    {data?.total_gas_consumption ? `${data.total_gas_consumption} kWh` : '0 kWh'}
                  </h3>
                  <p className="text-sm text-gray-500">Gas Consumption</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaFire className="text-orange-500 text-3xl" />
                </div>
              </div> */}
              {/* Flex amount */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#fff7e6] to-[#f8fafc] shadow-sm">
                <div>
                  <h3 className="text-2xl font-bold text-[#b38e5d]">
                    {data?.total_flex_amount ? `${data.total_flex_amount.toFixed(2)} kWh` : '0 kWh'}
                  </h3>
                  <p className="text-sm text-gray-500">Flex amount</p>
                </div>
                <div className="w-16 h-16 bg-[#fff7e6] rounded-full flex items-center justify-center shadow">
                  <FaHandHoldingUsd className="text-[#b38e5d] text-3xl" />
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EnergyPerformanceCard;
