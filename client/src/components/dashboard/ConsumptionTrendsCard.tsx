import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyConsumption } from "@shared/schema";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ConsumptionTrendsCard = () => {
  const { data: monthlyData, isLoading } = useQuery<MonthlyConsumption[]>({
    queryKey: ["/api/consumption/monthly"],
  });

  // Transform data for Recharts
  const chartData = monthlyData?.map((item) => ({
    month: item.month,
    electricity: item.electricityConsumption,
    gas: item.gasConsumption,
  }));

  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg col-span-1 lg:col-span-2 bg-gradient-to-br from-[#e6fbe6] via-[#f8fafc] to-[#e6f4fb] border border-[#b6e5b6]/40">
      <CardHeader className="p-5 border-b border-[#e6fbe6] bg-gradient-to-r from-[#e6fbe6] to-[#f8fafc]">
        <CardTitle className="text-xl font-extrabold text-[#388e3c] tracking-wide uppercase">Energy Consumption Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="h-[320px] w-full bg-gray-100 animate-pulse rounded-xl"></div>
        ) : (
          <div style={{ width: '100%', height: 320 }} className="bg-[#f8fbfd] rounded-xl p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 10,
                  bottom: 10,
                }}
              >
                <defs>
                  <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#43a047" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#43a047" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b38e5d" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#b38e5d" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6fbe6" />
                <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#388e3c', fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 13, fill: '#388e3c', fontWeight: 600 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, background: '#fff', border: '1px solid #e6fbe6', boxShadow: '0 2px 8px #e6fbe6' }}
                  labelStyle={{ color: '#388e3c', fontWeight: 700 }}
                  itemStyle={{ fontWeight: 600, color: '#388e3c' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 8 }} formatter={(value) => <span style={{ color: value === 'electricity' ? '#43a047' : '#b38e5d', fontWeight: 700 }}>{value === 'electricity' ? 'Electricity (kWh)' : 'Gas (kWh)'}</span>} />
                <Line
                  type="monotone"
                  dataKey="electricity"
                  name="Electricity (kWh)"
                  stroke="#43a047"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#43a047', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  fill="url(#colorElectricity)"
                  fillOpacity={1}
                />
                <Line
                  type="monotone"
                  dataKey="gas"
                  name="Gas (kWh)"
                  stroke="#b38e5d"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#b38e5d', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  fill="url(#colorGas)"
                  fillOpacity={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsumptionTrendsCard;
