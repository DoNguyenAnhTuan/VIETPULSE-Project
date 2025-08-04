import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Site } from "@shared/schema";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FaChevronDown, FaFire, FaMobileAlt, FaWind, FaRadiation, FaChartLine, FaWater, FaCar } from "react-icons/fa";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

// Thêm interface cho dữ liệu dự báo
interface ForecastItem {
  label: string;
  min: number;
  max: number;
}

const CarbonJourney = () => {
  const mapRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState("ALL SITES");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [forecastKey, setForecastKey] = useState(0);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCarbonModal, setShowCarbonModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showMLModal, setShowMLModal] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  




  const { data: sites } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  // Fetch forecast data
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const response = await fetch('/carbon_forecast.json'); // Đúng file ở public
        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Error loading forecast data:', error);
      }
    };
    fetchForecastData();
  }, [forecastKey]);

  const mockChartData = [
    { time: "29-Apr 00:00", actual: 150, forecast: 160 },
    { time: "29-Apr 12:00", actual: 220, forecast: 210 },
    { time: "30-Apr 00:00", actual: 180, forecast: 190 },
    { time: "30-Apr 12:00", actual: 200, forecast: 195 },
    { time: "01-May 00:00", actual: 170, forecast: 175 },
    { time: "01-May 12:00", actual: 190, forecast: 185 },
  ];

  const generationMixData = [
    { name: "gas", value: 41.9, color: "#002855" },
    { name: "imports", value: 17.6, color: "#9CA3AF" },
    { name: "biomass", value: 11.3, color: "#B38E5D" },
    { name: "nuclear", value: 11.6, color: "#F59E0B" },
    { name: "solar", value: 12.4, color: "#10B981" },
    { name: "wind", value: 5.1, color: "#8B5CF6" },
  ];

  const updateForecast = async () => {
    try {
      const response = await fetch('/api/update-data', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update data');
      }
      
      const result = await response.json();
      if (result.success) {
        // Force iframe to reload by updating key
        setForecastKey(prev => prev + 1);
        console.log('Data updated successfully');
      } else {
        console.error('Error updating data:', result.error);
      }
    } catch (error) {
      console.error('Failed to update data:', error);
    }
  };

  useEffect(() => {
    updateForecast();

    const interval = setInterval(updateForecast, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map centered at Eastern International University
      const map = L.map('eiu-map').setView([11.0526552, 106.6665097], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="
            background-color: #0B3D61;
            width: 30px;
            height: 40px;
            position: relative;
            border-radius: 8px 8px 24px 24px;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <div style="
              color: white;
              font-size: 16px;
              margin-top: -4px;
            ">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                <path d="M1 11V3C1 1.9 1.9 1 3 1h8v10H1zm2-8v6h6V3H3zM13 1h8c1.1 0 2 .9 2 2v8H13V1zm2 8h6V3h-6v6zM1 21c0-1.1.9-2 2-2h8v-6h10v6c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2z"/>
              </svg>
            </div>
            <div style="
              width: 10px;
              height: 10px;
              background-color: #4ADE80;
              border-radius: 50%;
              position: absolute;
              top: -2px;
              right: -2px;
              border: 2px solid white;
            "></div>
          </div>
        `,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
      });

      // Add markers for EIU locations
      const locations = [
        { 
          latitude: 11.0540552,
          longitude: 106.6663097,
          name: "B11"
        },
        { 
          latitude: 11.0544552,
          longitude: 106.6660097,
          name: "B8"
        },
        {
          latitude: 11.0523552,
          longitude: 106.6680097,
          name: "B3"
        },
        {
          latitude: 11.0519552,
          longitude: 106.6680097,
          name: "B6"
        },
        {
          latitude: 11.0537552,
          longitude: 106.6655097,
          name: "B10"
        },
        {
          latitude: 11.0536552,
          longitude: 106.6672097,
          name: "B4"
        },
        {
          latitude: 11.0535552,
          longitude: 106.6679097,
          name: "B5"
        },
        {
          latitude: 11.0550552,
          longitude: 106.6670097,
          name: "Canteen"
        },
        {
          latitude: 11.0498552,
          longitude: 106.6678097,
          name: "AMC"
        },
      ];

      // Add markers for all locations
      locations.forEach((location) => {
        L.marker([location.latitude, location.longitude], {
          icon: customIcon
        })
          .addTo(map)
          .bindPopup(`<b>Building ${location.name}</b>`);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  

  return (
    <div className="flex flex-col p-4 md:p-6 space-y-8 h-screen overflow-y-auto bg-gray-50">
      
      {/* Main grid for cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {/* About Card */}
        {/* <div id="about" className="text-center bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[320px] h-full">
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#002855' }}>About the Carbon Intensity API</h1>
          <p className="text-gray-600 text-base mt-2 leading-relaxed">
            EIU Carbon Intensity API cung cấp xu hướng cường độ carbon của hệ thống điện Việt Nam trước thời gian thực. API này cho phép truy cập lập trình và kịp thời cả dữ liệu dự báo và ước tính cường độ carbon.
          </p>
          <div className="flex justify-center space-x-3 mt-4">
            {[FaFire, FaMobileAlt, FaWind, FaRadiation, FaChartLine, FaWater, FaCar].map((Icon, index) => (
              <div key={index} className="p-2 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Dự báo chỉ bao gồm phát thải CO<sub>2</sub> liên quan đến sản xuất điện: các nhà máy lớn, nhập khẩu, tổn thất truyền tải/phân phối, nhu cầu điện quốc gia, điện gió và mặt trời phân tán.
          </p>
        </div> */}
        {/* About Card */}
        {/* <div id="about" className="text-center bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[320px] h-full transition-all duration-500 ease-in-out">
          <h1 className="text-2xl font-extrabold mb-2 text-[#002855]">
            About the VIETPULSE project
          </h1>

          <p className="text-gray-600 text-base mt-2 leading-relaxed">
            Dự án VIETPULSE (Vietnam Intelligent Energy Trading Platform for Upscaling Local Energy Storage and EV) - Nền tảng giao dịch năng lượng thông minh Việt Nam để nâng cấp năng lượng địa phương về lưu trữ và EV, là Dự án thí điểm tại Trường Đại học Quốc tế Miền Đông.
          </p>

          <div className="flex justify-center space-x-3 mt-4">
            {[FaFire, FaMobileAlt, FaWind, FaRadiation, FaChartLine, FaWater, FaCar].map((Icon, index) => (
              <div key={index} className="p-2 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            ))}
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            Dự án kéo dài 24 tháng với ngân sách 597.604 bảng Anh do chính phủ Anh tài trợ nhằm mục đích sử dụng trí tuệ nhân tạo và công nghệ Internet of Things để giải quyết các thách thức chuyển đổi năng lượng ở Việt Nam, nhằm cải thiện khả năng tiếp cận năng lượng tái tạo chi phí thấp, đồng thời đảm bảo an ninh cung cấp điện khi Việt Nam đặt mục tiêu đạt Net Zero vào năm 2050.
          </p> */}

          {/* About Card Preview (clickable) */}
          {/* VÙNG CLICK CARD */}
          <div
            id="about"
            onClick={() => setShowModal(true)}
            className="cursor-pointer text-center bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[320px] h-full transition-all duration-300 hover:scale-105"
          >
            <h1 className="text-2xl font-extrabold mb-2 text-[#002855]">About the VIETPLUSE project</h1>

            <p className="text-gray-600 text-base mt-2 leading-relaxed line-clamp-4">
              Dự án VIETPLUSE (Vietnam Intelligent Energy Trading Platform for Upscaling Local Energy Storage and EV) - Nền tảng giao dịch năng lượng thông minh Việt Nam để nâng cấp năng lượng địa phương về lưu trữ và EV, là Dự án thí điểm tại EIU.
            </p>

            <div className="flex justify-center space-x-3 mt-4">
              {[FaFire, FaMobileAlt, FaWind, FaRadiation, FaChartLine, FaWater, FaCar].map((Icon, index) => (
                <div key={index} className="p-2 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              ))}
            </div>

            <p className="text-gray-600 mt-4 text-sm italic">Bấm để xem chi tiết →</p>
          </div>

          {/* MODAL - tách ra ngoài div card */}
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
              onClick={() => setShowModal(false)} // click ngoài là tắt
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()} // chặn tắt khi click bên trong modal
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>

                <h2 className="text-2xl font-extrabold mb-4 text-[#002855] text-center">
                  About the VIETPULSE Project
                </h2>

                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Dự án VIETPULSE kéo dài 24 tháng với ngân sách 597.604 bảng Anh do chính phủ Anh tài trợ nhằm mục đích sử dụng trí tuệ nhân tạo và công nghệ Internet of Things để giải quyết các thách thức chuyển đổi năng lượng ở Việt Nam, nhằm cải thiện khả năng tiếp cận năng lượng tái tạo chi phí thấp ở Việt Nam, đồng thời đảm bảo an ninh cung cấp điện khi Việt Nam đặt mục tiêu đạt Net Zero vào năm 2050.
                </p>

                <p className="text-gray-700 text-base leading-relaxed mb-3">
                  Dự án VIETPULSE kéo dài 24 tháng với ngân sách 597.604 bảng Anh do chính phủ Anh tài trợ nhằm mục đích sử dụng trí tuệ nhân tạo và công nghệ Internet of Things để giải quyết các thách thức chuyển đổi năng lượng ở Việt Nam, nhằm cải thiện khả năng tiếp cận năng lượng tái tạo chi phí thấp ở Việt Nam, đồng thời đảm bảo an ninh cung cấp điện khi Việt Nam đặt mục tiêu đạt Net Zero vào năm 2050.
                </p>
                <img
                    src="./assets/images/VIETPLUSE.jpg"
                    alt="Sơ đồ kết nối kỹ thuật"
                    className="my-6 mx-auto max-w-full h-auto rounded-xl shadow"
                  />

                <p className="text-gray-700 text-base leading-relaxed">
                  Trong khuôn khổ dự án, EIU cũng thực hiện các nghiên cứu chuyên sâu về Carbon Intensity (cường độ carbon), đây là thước đo hiệu quả phát thải carbon trong hệ thống điện trong kỷ nguyên chuyển đổi năng lượng. Trang web này được thực hiện bởi nhóm dự án EIU, xây dựng hệ thống tính toán cường độ carbon theo thời gian thực cho lưới điện Việt Nam.
                </p>
              </div>
            </div>
          )}

        {/* Current Carbon Intensity Card */}
        {/* <div className="bg-gradient-to-br from-[#f7ecd7] to-[#f3f6fa] shadow-2xl rounded-2xl p-6 flex flex-col items-center border border-[#e5e7eb] min-h-[320px] h-full text-center">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#B38E5D' }}>Current Carbon Intensity</h2>
            <span className="inline-flex items-center justify-center rounded-full bg-[#f3e6c6] p-3 shadow-md mb-4">
              <FaChartLine className="text-3xl text-[#B38E5D]" />
            </span>
          </div>
          <h2 className="text-5xl font-extrabold mb-2 mt-2 flex items-end justify-center" style={{ color: '#B38E5D', minHeight: '56px' }}>
            {typeof window !== 'undefined' && window.energyTotalConsumptionMWh
              ? (parseFloat(window.energyTotalConsumptionMWh) * 0.6592).toFixed(2)
              : '...'}
            <span className="text-xl font-medium text-gray-700 ml-2 mb-1">gCO₂/kWh</span>
          </h2>
          <div className="text-gray-500 text-sm mt-2 text-center">Tính toán dựa trên tổng tiêu thụ điện hiện tại</div>
        </div> */}

        {/* Current Carbon Intensity Card */}
        <div
          id="carbon-intensity"
          onClick={() => setShowCarbonModal(true)}
          className="bg-gradient-to-br from-[#f7ecd7] to-[#f3f6fa] shadow-2xl rounded-2xl p-6 flex flex-col items-center border border-[#e5e7eb] min-h-[320px] h-full text-center cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div className="flex flex-col items-center w-full">
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#B38E5D' }}>
              Current Carbon Intensity
            </h2>
            <span className="inline-flex items-center justify-center rounded-full bg-[#f3e6c6] p-3 shadow-md mb-4">
              <FaChartLine className="text-3xl text-[#B38E5D]" />
            </span>
          </div>
          <h2
            className="text-5xl font-extrabold mb-2 mt-2 flex items-end justify-center"
            style={{ color: '#B38E5D', minHeight: '56px' }}
          >
            {/* {typeof window !== 'undefined' && window.energyTotalConsumptionMWh
              ? (parseFloat(window.energyTotalConsumptionMWh) * 0.6592).toFixed(2)
              : '...'} */}
            {(() => {
              if (typeof window === 'undefined') return '...';

              const consumption = window.energyTotalConsumptionMWh || sessionStorage.getItem("energyTotalConsumptionMWh");
              return consumption ? (parseFloat(consumption) * 0.6592).toFixed(2) : '...';
            })()}

            <span className="text-xl font-medium text-gray-700 ml-2 mb-1">gCO₂/kWh</span>
          </h2>
          <div className="text-gray-500 text-sm mt-2 text-center">
            Tính toán dựa trên tổng tiêu thụ điện hiện tại
          </div>
          <p className="text-gray-600 mt-4 text-sm italic">Bấm để xem chi tiết →</p>
        </div>

        {/* Carbon Intensity Modal */}
        {showCarbonModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
            onClick={() => setShowCarbonModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setShowCarbonModal(false)}
              >
                &times;
              </button>

              <h2 className="text-2xl font-extrabold mb-4 text-[#B38E5D] text-center">
                Carbon Intensity là gì?
              </h2>

              <p className="text-gray-700 text-base leading-relaxed mb-4">
                Trong cuộc đua toàn cầu hướng tới trung hòa carbon (Net Zero), một trong những chỉ số được các nhà hoạch định chính sách, doanh nghiệp và nhà đầu tư xanh đặc biệt quan tâm chính là <strong>Carbon Intensity</strong> – hay còn gọi là <strong>cường độ carbon</strong>.
              </p>

              <h3 className="text-xl font-bold mb-2 text-[#B38E5D]">Vì sao Carbon Intensity quan trọng?</h3>

              <ul className="list-disc pl-5 text-gray-700 space-y-3">
                <li>
                  <strong>Đánh giá hiệu quả môi trường theo chiều sâu:</strong> Khác với tổng phát thải (total emissions), carbon intensity cho phép so sánh hiệu suất carbon giữa các công nghệ, ngành nghề, hoặc quốc gia – ngay cả khi quy mô sản xuất khác nhau.
                </li>
                <li>
                  <strong>Cơ sở thiết lập mục tiêu giảm phát thải khoa học:</strong> Nhiều quốc gia và doanh nghiệp sử dụng carbon intensity như một chỉ số trung tâm trong chiến lược giảm phát thải.
                </li>
                <li>
                  <strong>Thước đo đầu tư xanh & báo cáo ESG:</strong> Các nhà đầu tư hiện ưu tiên những doanh nghiệp có carbon intensity thấp, thể hiện cam kết với phát triển bền vững.
                </li>
                <li>
                  <strong>So sánh & minh bạch hóa nỗ lực khí hậu toàn cầu:</strong> Carbon intensity giúp theo dõi mức độ chuyển đổi năng lượng ở quy mô quốc gia và ngành.
                </li>
              </ul>
            </div>
          </div>
        )}


        {/* 3-Month Forecast Card */}
        {/* <div className="bg-white shadow-xl rounded-2xl p-6 border border-[#e5e7eb] flex flex-col min-h-[320px] h-full items-center justify-center text-center">
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#002855' }}>3-Month Carbon Intensity Forecast</h2>
          <p className="text-xs text-gray-500 mb-4">Giá trị dự báo cường độ carbon (tấn CO₂/ngày)</p>
          <div className="flex-1 w-full flex flex-col items-center justify-center">
            {forecastData.length === 0 ? (
              <div className="text-gray-400 text-center">No forecast data available.</div>
            ) : (
              forecastData.map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm border border-gray-100 mb-2 w-full max-w-xs mx-auto">
                  <span className="text-base font-semibold text-[#002855]">{item.label}</span>
                  <div className="flex space-x-4 font-semibold">
                    <span className="text-red-500 flex items-center">
                      <svg width="14" height="14" fill="currentColor" className="mr-1" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {item.max}
                    </span>
                    <span className="text-green-600 flex items-center">
                      <svg width="14" height="14" fill="currentColor" className="mr-1" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item.min}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}
      {/* 3-Month Forecast Card */}
      <div
        onClick={() => setShowForecastModal(true)}
        className="bg-white shadow-xl rounded-2xl p-6 border border-[#e5e7eb] flex flex-col min-h-[320px] h-full items-center justify-center text-center cursor-pointer transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#002855' }}>
          3-Month Carbon Intensity Forecast
        </h2>
        <p className="text-xs text-gray-500 mb-4">Giá trị dự báo cường độ carbon (tấn CO₂/ngày)</p>

        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {forecastData.length === 0 ? (
            <div className="text-gray-400 text-center">No forecast data available.</div>
          ) : (
            forecastData.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm border border-gray-100 mb-2 w-full max-w-xs mx-auto"
              >
                <span className="text-base font-semibold text-[#002855]">{item.label}</span>
                <div className="flex space-x-4 font-semibold">
                  <span className="text-red-500 flex items-center">
                    <svg width="14" height="14" fill="currentColor" className="mr-1" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.max}
                  </span>
                  <span className="text-green-600 flex items-center">
                    <svg width="14" height="14" fill="currentColor" className="mr-1" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.min}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-gray-600 mt-4 text-sm italic">Bấm để xem chi tiết →</p>
      </div>
      {showForecastModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          onClick={() => setShowForecastModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowForecastModal(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-extrabold mb-4 text-[#002855] text-center">
              Dự báo Carbon Intensity của lưới điện Việt Nam
            </h2>

            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Trong bối cảnh Việt Nam đang đẩy mạnh quá trình chuyển dịch năng lượng và cam kết trung hòa carbon vào năm 2050, việc theo dõi và dự báo <strong>Carbon Intensity (CI)</strong> của hệ thống điện quốc gia là yếu tố then chốt để đánh giá hiệu quả giảm phát thải.
            </p>

            <h3 className="text-xl font-bold mb-2 text-[#002855]">Carbon Intensity của lưới điện là gì?</h3>
            <p className="text-gray-700 mb-3">
              <strong>Carbon Intensity (CI)</strong> của lưới điện là chỉ số thể hiện lượng CO₂ phát thải ra để sản xuất mỗi đơn vị điện năng (kWh) được đưa vào lưới. Đây là thước đo hiệu quả phát thải của hệ thống điện quốc gia theo thời gian.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#002855] mb-4">
              <p className="font-semibold text-[#002855]">Công thức tính:</p>
              {/* <p className="text-sm text-gray-800 mt-2 italic">
                CI = (∑ Pi × EFi) / ∑ Pi
              </p> */}
              <img
                    src="./assets/images/congthuc.png"
                    alt="Công thức tính Carbon Intensity"
                    className="my-6 mx-auto max-w-full h-auto rounded-xl shadow bg-white"
                  />
              <ul className="text-sm text-gray-700 mt-2 list-disc pl-5">
                <li><code>CI</code>: <strong>Cường độ carbon</strong> (Carbon Intensity) – lượng CO₂ phát thải trung bình trên mỗi kWh điện sản xuất (đơn vị: <code>gCO₂/kWh</code>)</li>
                <li><code>i</code>: Chỉ số đại diện cho từng loại nguồn điện (như than, khí, thủy điện, mặt trời...)</li>
                <li><code>P<sub>i</sub></code>: Công suất hoặc sản lượng điện từ nguồn thứ <code>i</code> (đơn vị: <code>kWh</code>)</li>
                <li><code>EF<sub>i</sub></code>: Hệ số phát thải (Emission Factor) của nguồn điện <code>i</code> (đơn vị: <code>gCO₂/kWh</code>) – thể hiện lượng CO₂ sinh ra khi sản xuất 1 kWh từ nguồn đó</li>
                <li><code>∑<sub>i</sub></code>: Tổng cộng qua tất cả các loại nguồn điện</li>
              </ul>
            </div>

            <p className="text-gray-700">
              Nhóm nghiên cứu sử dụng <strong>dữ liệu công suất theo loại hình (nhiệt điện, thủy điện, NLTT...)</strong> kết hợp với <strong>thuật toán học máy</strong> để dự báo CI trong 3 tháng tiếp theo. Điều này hỗ trợ đánh giá rủi ro phát thải và tối ưu chiến lược sử dụng điện.
            </p>
          </div>
        </div>
      )}
      </div>

      {/* Update Data Button */}


      {/* National Data & Generation Mix in one grid row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* National Data */}
        {/* <div id="national" className="w-full flex flex-col h-full">
          <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] p-8 hover:shadow-primary/30 transition-shadow duration-200 justify-between">
            <h2 className="text-2xl font-extrabold text-center mb-3 text-primary tracking-wide">National Data</h2>
            <div className="text-center text-sm text-gray-500 mb-3">Forecast & Actual Carbon Intensity (7 days)</div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-[380px] w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <iframe 
                  key={forecastKey}
                  src="/forecast.html" 
                  className="w-full h-full"
                  frameBorder="0"
                  title="Carbon Forecast Chart"
                  style={{ border: 'none', minHeight: '360px' }}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400 text-center">Orange: Actual | Blue: Forecast</div>
          </div>
        </div> */}
        {/* National Data & Generation Mix in one grid row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"> */}
          {/* National Data */}
          <div
            id="national"
            onClick={() => setShowMLModal(true)}
            className="w-full flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] p-8 hover:shadow-primary/30 transition-shadow duration-200 justify-between cursor-pointer hover:scale-105"
          >
            <h2 className="text-2xl font-extrabold text-center mb-3 text-primary tracking-wide">
              National Data
            </h2>
            <div className="text-center text-sm text-gray-500 mb-3">
              Forecast & Actual Carbon Intensity (7 days)
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-[380px] w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <iframe
                  key={forecastKey}
                  src="/forecast.html"
                  className="w-full h-full"
                  frameBorder="0"
                  title="Carbon Forecast Chart"
                  style={{ border: 'none', minHeight: '360px' }}
                />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400 text-center">
              Orange: Actual | Blue: Forecast
            </div>
            <p className="text-gray-600 mt-4 text-sm italic text-center">
              Bấm để xem chi tiết →
            </p>
          </div>

          {/* Modal for ML Forecasting */}
          {showMLModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
              onClick={() => setShowMLModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                  onClick={() => setShowMLModal(false)}
                >
                  &times;
                </button>

                <h2 className="text-2xl font-extrabold mb-4 text-[#002855] text-center">
                  Dự báo Carbon Intensity bằng thuật toán học máy (ML)
                </h2>

                <h3 className="text-xl font-bold mb-2 text-[#002855]">Mục tiêu:</h3>
                <p className="text-gray-700 mb-4">
                  Xây dựng mô hình học máy để dự báo CI của lưới điện trong các ngày tới dựa trên lịch sử vận hành công suất từng loại nguồn phát.
                </p>

                <h3 className="text-xl font-bold mb-2 text-[#002855]">Quy trình:</h3>
                <ol className="list-decimal pl-5 text-gray-700 space-y-2 mb-4">
                  <li><strong>Thu thập dữ liệu:</strong> Crawl công suất phát hàng ngày từ EVN/A0 → tạo time series</li>
                  <li><strong>Tính toán CI thực tế:</strong> theo công thức chuẩn</li>
                  <li><strong>Tiền xử lý:</strong> Làm sạch, tạo lag features, thêm yếu tố phụ trợ như thời tiết</li>
                  <li><strong>Xây dựng mô hình:</strong> XGBoost / RF / LSTM dự báo CI ngày kế tiếp hoặc 3–7 ngày</li>
                  <li><strong>Đánh giá mô hình:</strong> RMSE, MAE, MAPE so với dữ liệu thật</li>
                </ol>

                <h3 className="text-xl font-bold mb-2 text-[#002855]">Kết quả minh họa:</h3>
                <table className="w-full text-sm mb-4 border border-gray-300">
                  <thead className="bg-gray-100 text-[#002855]">
                    <tr>
                      <th className="border px-3 py-2">Ngày</th>
                      <th className="border px-3 py-2">CI thực tế</th>
                      <th className="border px-3 py-2">CI dự báo</th>
                      <th className="border px-3 py-2">Sai số</th>
                    </tr>
                  </thead>
                  <tbody className="text-center text-gray-700">
                    <tr>
                      <td className="border px-3 py-1">25/07/2025</td>
                      <td className="border px-3 py-1">475</td>
                      <td className="border px-3 py-1">462</td>
                      <td className="border px-3 py-1">-13</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-1">26/07/2025</td>
                      <td className="border px-3 py-1">480</td>
                      <td className="border px-3 py-1">485</td>
                      <td className="border px-3 py-1">+5</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-1">27/07/2025</td>
                      <td className="border px-3 py-1">510</td>
                      <td className="border px-3 py-1">497</td>
                      <td className="border px-3 py-1">-13</td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-gray-700 mb-4">
                  Mô hình có sai số trung bình <strong>dưới 3%</strong>, đủ chính xác để hỗ trợ:
                </p>
                <ul className="list-disc pl-5 text-gray-700 mb-4 space-y-1">
                  <li>Lập kế hoạch vận hành lưới điện phát thải thấp</li>
                  <li>Cảnh báo sớm cho các nhà máy sản xuất lớn</li>
                  <li>Tự động tạo báo cáo ESG hàng ngày hoặc hàng tuần</li>
                </ul>

                <h3 className="text-xl font-bold mb-2 text-[#002855]">Ứng dụng thực tiễn</h3>
                <ul className="list-disc pl-5 text-gray-700 mb-4 space-y-1">
                  <li>EVN có thể ưu tiên huy động nguồn sạch vào thời điểm CI thấp</li>
                  <li>Doanh nghiệp giảm "carbon footprint" bằng cách điều chỉnh lịch sản xuất</li>
                  <li>Tạo niềm tin ESG cho nhà đầu tư và tổ chức quốc tế</li>
                </ul>

                <h3 className="text-xl font-bold mb-2 text-[#002855]">Đề xuất mở rộng</h3>
                <ul className="list-disc pl-5 text-gray-700 mb-2 space-y-1">
                  <li>Tích hợp dữ liệu thời tiết</li>
                  <li>Dự báo CI theo khung giờ (hourly)</li>
                  <li>Triển khai dashboard online theo thời gian thực</li>
                </ul>
              </div>
            </div>
          )}
        

        {/* Generation Mix */}
        {/* <div id="generation" className="w-full flex flex-col h-full">
          <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] p-8 hover:shadow-primary/30 transition-shadow duration-200 justify-between">
            <h2 className="text-2xl font-extrabold text-center mb-3 text-primary tracking-wide">Vietnam Power Sources</h2>
            <div className="text-center text-sm text-gray-500 mb-3">Tỉ lệ nguồn phát điện hiện tại</div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="h-[380px] w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
                <iframe 
                  key={forecastKey}
                  src="/power_sources.html" 
                  className="w-full h-full"
                  frameBorder="0"
                  title="Power Sources Chart"
                  style={{ border: 'none', minHeight: '360px' }}
                />
              </div>
            </div>
          </div>
        </div> */}


        {/* Generation Mix Card */}
        <div
          id="generation"
          onClick={() => setShowGenerationModal(true)}
          className="w-full flex flex-col h-full bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] p-8 hover:shadow-primary/30 transition-shadow duration-200 justify-between cursor-pointer hover:scale-105"
        >
          <h2 className="text-2xl font-extrabold text-center mb-3 text-primary tracking-wide">
            Vietnam Power Sources
          </h2>
          <div className="text-center text-sm text-gray-500 mb-3">
            Tỉ lệ nguồn phát điện hiện tại
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[380px] w-full rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
              <iframe
                key={forecastKey}
                src="/power_sources.html"
                className="w-full h-full"
                frameBorder="0"
                title="Power Sources Chart"
                style={{ border: 'none', minHeight: '360px' }}
              />
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm italic text-center">
            Bấm để xem chi tiết →
          </p>
        </div>

        {/* Modal for Power Sources */}
        {showGenerationModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
            onClick={() => setShowGenerationModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setShowGenerationModal(false)}
              >
                &times;
              </button>

              <h2 className="text-2xl font-extrabold mb-4 text-[#002855] text-center">
                Biểu đồ Nguồn Điện Quốc Gia Việt Nam
              </h2>

              <p className="text-gray-700 text-base leading-relaxed mb-4">
                Biểu đồ bạn đang xem là biểu đồ <strong>Donut Power Source</strong>, hiển thị tỷ lệ đóng góp của từng loại nguồn điện vào tổng sản lượng điện quốc gia trong thời điểm hiện tại.
              </p>

              <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-[#002855] mb-4">
                <p className="text-sm text-gray-800 mb-2">
                  Biểu đồ này được tổng hợp từ dữ liệu <strong>NSMO.vn</strong> – Trung tâm Điều độ Hệ thống Điện Quốc gia.
                </p>
                <ul className="text-sm text-gray-700 list-disc pl-5">
                  <li><strong>Nhiệt điện:</strong> Than, khí, dầu</li>
                  <li><strong>Thủy điện:</strong> Các nhà máy thủy điện lớn và nhỏ</li>
                  <li><strong>Năng lượng tái tạo:</strong> Điện mặt trời, điện gió</li>
                  <li><strong>Nhập khẩu điện:</strong> Từ Trung Quốc, Lào, Campuchia</li>
                </ul>
              </div>

              <p className="text-gray-700">
                Thông tin này giúp theo dõi xu hướng phát triển năng lượng sạch và mức độ phụ thuộc vào từng loại nguồn phát điện, phục vụ đánh giá chiến lược <strong>chuyển dịch năng lượng</strong> và <strong>giảm phát thải CO₂</strong> trong dài hạn.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Regional Data - 2 columns: map left, table right, full width like above */}
      <div id="regional" className="w-full">
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#002855' }}>Regional Data</h2>
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-[#e5e7eb]">
          <p className="text-gray-600 text-center mb-6">
            Our solution provides forecasts of carbon intensity and generation mix across 14 geographical regions in VietNam.
            Click on a region to view its current carbon intensity and generation mix, or use the play button to see a 24-hour forecast.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
            {/* Map left */}
            <div className="space-y-4 w-full">
              <h3 className="text-xl font-semibold text-center" style={{ color: '#002855' }}>Eastern International University</h3>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <div id="eiu-map" className="w-full h-[400px] rounded-lg"></div>
              </div>
            </div>
            {/* Table right */}
            <div className="mt-0 md:mt-6 w-full">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energy Usage (kWh)</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 1, name: "B11", usage: 145, status: "moderate" },
                      { id: 2, name: "B8", usage: 47, status: "low" },
                      { id: 3, name: "B3", usage: 198, status: "high" },
                      { id: 4, name: "B6", usage: 156, status: "moderate" },
                      { id: 5, name: "B10", usage: 188, status: "high" },
                      { id: 6, name: "B4", usage: 156, status: "moderate" },
                      { id: 7, name: "B5", usage: 166, status: "moderate" },
                      { id: 8, name: "Canteen", usage: 210, status: "high" },
                      { id: 9, name: "AMC", usage: 85, status: "low" },
                    ].map((block) => (
                      <tr key={block.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{block.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{block.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{block.usage}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            block.status === 'low' ? 'bg-green-100 text-green-800' :
                            block.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {block.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                    Low: &lt; 100 kWh
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                    Moderate: 100-180 kWh
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                    High: &gt; 180 kWh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
    
  );
};

export default CarbonJourney;