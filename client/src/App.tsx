// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Layout from './components/layout/Layout';
// import Home from './pages/Home';
// import Meters from './pages/Meters';
// import CarbonJourney from './pages/CarbonJourney';
// import BillingReport from './pages/BillingReport';
// import Login from './pages/Login';
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import ProfilePage from "@/pages/ProfilePage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={
//           <ProtectedRoute>
//             <Layout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<Home />} />
//           <Route path="meters" element={<Meters />} />
//           <Route path="carbon-journey" element={<CarbonJourney />} />
//           <Route path="billing-report" element={<BillingReport />} />
//           <Route path="profile" element={<ProfilePage />} />
//         </Route>
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Layout from './components/layout/Layout';
// import Home from './pages/Home';
// import Meters from './pages/Meters';
// import CarbonJourney from './pages/CarbonJourney';
// import BillingReport from './pages/BillingReport';
// import Login from './pages/Login';
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import ProfilePage from "@/pages/ProfilePage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Trang login riêng */}
//         <Route path="/login" element={<Login />} />

//         {/* Layout áp dụng chung cho các route con */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="carbon-journey" element={<CarbonJourney />} />
//           <Route path="billing-report" element={<BillingReport />} />
//           <Route path="profile" element={<ProfilePage />} />

//           {/* Chỉ riêng trang /meters mới cần login */}
//           <Route
//             path="meters"
//             element={
//               <ProtectedRoute>
//                 <Meters />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* Redirect các route không hợp lệ */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Meters from './pages/Meters';
import CarbonJourney from './pages/CarbonJourney';
import BillingReport from './pages/BillingReport';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang login riêng */}
        <Route path="/login" element={<Login />} />

        {/* Layout áp dụng chung cho các route con */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="carbon-journey" element={<CarbonJourney />} />
          {/* <Route path="billing-report" element={<BillingReport />} /> */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Chỉ riêng trang /meters mới cần login */}
          <Route
            path="meters"
            element={
              <ProtectedRoute>
                <Meters />
              </ProtectedRoute>
            }
          />
          <Route path="billing-report" element={<BillingReport />} />
        </Route>
        

        {/* Redirect các route không hợp lệ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Layout from "./components/layout/Layout";
// import Home from "./pages/Home";
// import Meters from "./pages/Meters";
// import CarbonJourney from "./pages/CarbonJourney";
// import BillingReport from "./pages/BillingReport";
// import Login from "./pages/Login";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import ProfilePage from "@/pages/ProfilePage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Trang login riêng */}
//         <Route path="/login" element={<Login />} />

//         {/* Layout chung */}
//         <Route path="/" element={<Layout />}>
//           {/* (Tuỳ chọn) Nếu muốn vào "/" tự chuyển sang trang public */}
//           {/* <Route index element={<Navigate to="/carbon-journey" replace />} /> */}

//           {/* Home: cần login */}
//           <Route
//             index
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />

//           {/* CarbonJourney: PUBLIC */}
//           <Route path="carbon-journey" element={<CarbonJourney />} />

//           {/* Profile: cần login */}
//           <Route
//             path="profile"
//             element={
//               <ProtectedRoute>
//                 <ProfilePage />
//               </ProtectedRoute>
//             }
//           />

//           {/* Meters: cần login */}
//           <Route
//             path="meters"
//             element={
//               <ProtectedRoute>
//                 <Meters />
//               </ProtectedRoute>
//             }
//           />

//           {/* Billing Reports: cần login */}
//           <Route
//             path="billing-report"
//             element={
//               <ProtectedRoute>
//                 <BillingReport />
//               </ProtectedRoute>
//             }
//           />
//         </Route>

//         {/* Redirect các route không hợp lệ */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


