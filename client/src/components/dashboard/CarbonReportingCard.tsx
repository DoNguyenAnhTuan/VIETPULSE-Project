import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaLeaf, FaChartLine, FaGlobeAsia } from "react-icons/fa";

const CarbonReportingCard = () => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-[#e6fbe6] via-[#f8fafc] to-[#e6f4fb] border border-[#b6e5b6]/40">
      <CardHeader className="p-5 border-b border-[#e6fbe6] bg-gradient-to-r from-[#e6fbe6] to-[#f8fafc]">
        <CardTitle className="text-xl font-extrabold text-[#388e3c] tracking-wide uppercase">Carbon Reporting</CardTitle>
      </CardHeader>
      <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="mb-6 flex flex-col items-center">
          <span className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#b6e5b6]/60 text-[#388e3c] text-5xl mb-2 shadow-md border-4 border-[#facc15]/30">
            <FaLeaf />
          </span>
          <span className="text-lg font-bold text-[#388e3c] tracking-wide">Unlock Sustainability Insights</span>
        </div>
        <ul className="mb-6 text-[#388e3c] text-base space-y-2 text-left max-w-md mx-auto font-medium">
          <li className="flex items-center gap-2"><FaChartLine className="text-[#388e3c]" /> Track and reduce your carbon footprint</li>
          <li className="flex items-center gap-2"><FaGlobeAsia className="text-[#b38e5d]" /> Meet ESG & compliance requirements</li>
          <li className="flex items-center gap-2"><FaLeaf className="text-[#43a047]" /> Enhance your brand’s green reputation</li>
        </ul>
        {/* <div className="mb-4 text-gray-500 text-sm max-w-md mx-auto">
          Activate carbon reporting to access detailed emissions analytics, automated reports, and actionable recommendations for your business.
        </div> */}
        <Button className="bg-gradient-to-r from-[#43a047] to-[#b38e5d] hover:from-[#b38e5d] hover:to-[#43a047] text-white rounded-full border-0 shadow font-bold px-8 py-2 text-base mt-2 uppercase tracking-widest">
          Contact Us to Enable
        </Button>
      </CardContent>
    </Card>
  );
};

export default CarbonReportingCard;
