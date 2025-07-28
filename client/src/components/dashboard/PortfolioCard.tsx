import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaBolt, FaTachometerAlt, FaPlug } from "react-icons/fa";

interface AssetCounts {
  totalFlexibleAssets: number;
  totalMeters: number;
  totalSmartMeters: number;
}

const PortfolioCard = () => {
  const { data, isLoading } = useQuery<AssetCounts>({
    queryKey: ["/api/assets/counts"],
  });

  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg bg-white">
      <CardHeader className="p-5 border-b border-[#f4f8fb] flex flex-row items-center justify-between bg-gradient-to-r from-[#f8fbfd] to-[#e6f0fa]">
        <CardTitle className="text-xl font-bold text-[#0B3D61] tracking-wide">Your Portfolio</CardTitle>
        <a
          href="#"
          className="px-5 py-2 rounded-full font-bold text-white text-sm uppercase shadow-md bg-gradient-to-r from-[#43a047] via-[#388e3c] to-[#0B3D61] transition-all duration-200 hover:from-[#388e3c] hover:to-[#008080] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:ring-offset-2"
        >
          View More
        </a>
      </CardHeader>
      <CardContent className="p-6 space-y-5 bg-white">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </>
        ) : (
          <>
            {/* Flexible assets */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#fff7e6] text-[#b38e5d] text-xl">
                  <FaBolt />
                </span>
                <span className="text-gray-700 font-medium">Flexible Assets</span>
              </div>
              <span className="text-2xl font-bold text-[#b38e5d]">{data?.totalFlexibleAssets || 0}</span>
            </div>
            {/* Meters */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#e6f0fa] text-[#0B3D61] text-xl">
                  <FaTachometerAlt />
                </span>
                <span className="text-gray-700 font-medium">Meters</span>
              </div>
              <span className="text-2xl font-bold text-[#0B3D61]">{data?.totalMeters || 0}</span>
            </div>
            {/* Electricity Smart Meters */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#e6fbe6] to-[#f8fafc] shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#e6fbe6] text-[#43a047] text-xl">
                  <FaPlug />
                </span>
                <span className="text-gray-700 font-medium">Electricity - Smart Meters</span>
              </div>
              <span className="text-2xl font-bold text-[#43a047]">{data?.totalSmartMeters || 0}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioCard;
