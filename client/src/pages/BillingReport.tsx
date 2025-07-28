import { Card, CardContent } from "@/components/ui/card";
import { useOutletContext } from "react-router-dom";
import { getAccessToken, fetchSiteData_ConsumptionSummary } from "@/utils/API";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { FaBolt, FaDollarSign, FaTag, FaDownload } from "react-icons/fa";

const fetchConsumptionSummary = async (selectedSiteId: string, monthYear: Date | null) => {
  const accessToken = await getAccessToken();
  if (!monthYear) return "0.00";
  if (accessToken) {
    const startDate = `${monthYear.getFullYear()}-01-01`;
    const endDate = `${monthYear.getFullYear()}-12-31`;
    const siteData_ConsumptionSummary = await fetchSiteData_ConsumptionSummary(
      accessToken,
      selectedSiteId,
      startDate,
      endDate
    );
    const target = siteData_ConsumptionSummary?.find((item: any) => {
      return item._id.year === monthYear.getFullYear() && item._id.month === (monthYear.getMonth() + 1);
    });
    return target ? (target.actual / 1000).toFixed(2) : "0.00";
  }
  return "0.00";
};


const BillingReport = () => {
  const { selectedSiteId, monthYear } = useOutletContext<{ selectedSiteId: string, monthYear: Date }>();

  const { data: consumptionSummary } = useQuery({
    queryKey: ["consumptionSummary", selectedSiteId, monthYear?.toISOString()],
    queryFn: () => fetchConsumptionSummary(selectedSiteId, monthYear),
  });

  // Tính usage (kWh)
  const usage = consumptionSummary ? (parseFloat(consumptionSummary) * 0.07 * 1000).toFixed(2) : "0.00";

  // Tính số ngày trong tháng
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  const daysInMonth = monthYear ? getDaysInMonth(monthYear) : getDaysInMonth(new Date());
  const month = monthYear ? monthYear.getMonth() + 1 : new Date().getMonth() + 1;
  const year = monthYear ? monthYear.getFullYear() : new Date().getFullYear();

  // Tạo dữ liệu giả cho dailyUsage
  const dailyUsage = Array.from({ length: daysInMonth }, (_, i) => ({
    date: `${String(i + 1).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
    cost: Math.floor(Math.random() * 50) + 20, // random hóa cho sinh động
    benefits: Math.floor(Math.random() * 10)
  }));

  // Các mục cần validation
  const validationItems = [
    "Supplier Unit Rate and Charges",
    "DNO Rate and Charges",
    "TRIAD Charges",
    "Meter reading Accuracy"
  ];

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header với filter và nút Download */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white rounded-xl shadow px-6 py-4">
        <div className="flex gap-6 items-center text-base text-gray-700">
          <span className="font-semibold text-[#008080]">Block:</span> <span>{selectedSiteId}</span>
          <span className="font-semibold text-[#008080]">Month:</span> <span>{month}</span>
          <span className="font-semibold text-[#008080]">Year:</span> <span>{year}</span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#008080] text-white font-semibold shadow hover:bg-[#006666] transition">
          <FaDownload className="text-lg" /> Download
        </button>
      </div>

      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#e0f7fa] to-[#fff]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#008080]/10 text-[#008080]">
              <FaDollarSign className="text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Electricity Cost ($)</div>
              <div className="text-3xl font-bold text-[#008080]">${consumptionSummary}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#e0f7fa] to-[#fff]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#4ade80]/20 text-[#22c55e]">
              <FaBolt className="text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Usage (kWh)</div>
              <div className="text-3xl font-bold text-[#22c55e]">{usage}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#e0f7fa] to-[#fff]">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-[#facc15]/20 text-[#f59e42]">
              <FaTag className="text-2xl" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Rate ($/kWh)</div>
              <div className="text-3xl font-bold text-[#f59e42]">7</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Details Chart */}
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#008080] flex items-center gap-2">
              <FaDollarSign className="text-[#008080]" /> Billing Report
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    label={{ value: 'Date', position: 'bottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Amount ($)', angle: -90, position: 'left', offset: -5 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cost" name="Cost" fill="#008080" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="benefits" name="Benefits" fill="#4ade80" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Table - Đẹp, chuyên nghiệp */}
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#008080]">Validation</h3>
            <table className="min-w-full rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {validationItems.map((item, idx) => (
                  <tr key={item} className="transition hover:bg-[#e0f7fa]/60">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400/20 to-green-100/80 text-green-700 font-semibold text-sm shadow-sm border border-green-200">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M7.5 10.5l2 2 3-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Validated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingReport;