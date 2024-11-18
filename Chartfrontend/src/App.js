// App.js
import { Routes, Route } from "react-router-dom";

import RegistrationMain from "./RegistrationMain/RegistrationMain";
import LoginMain from "./LoginMain/LoginMain";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import { motion } from "framer-motion";
import AccessForm from "./AccessForm/AccessForm";
import Chart from "./Chart/Chart";

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

function App() {
  return (
    <div className="App">
      <motion.section
        className="h-full bg-gray-950"
        style={{
          backgroundImage:
            "radial-gradient(125% 125% at 50% 0%, #f2e9e9 40%, #2078d6)",
        }}
      >
        <Routes>
          <Route path="/" element={<LoginMain />} />
          <Route path="/sign-up" element={<RegistrationMain />} />
          <Route path="/access-form" element={<AccessForm />} />
          <Route path="/chart" element={<Chart />} />
        </Routes>
      </motion.section>
    </div>
  );
}

export default App;
