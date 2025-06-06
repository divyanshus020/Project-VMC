// components/Footer.js
import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="bg-[#F5F5F5] border-t border-gray-300 py-6 mt-10">
      <div className=" mx-auto flex items-center justify-center text-center text-[#666666] text-sm font-sans">
        <p className="text-[#333333] font-semibold text-base">
          © {new Date().getFullYear()} YourCompanyName. All rights reserved.
        </p>
        <p className="text-[#D4AF37] font-bold mt-1">
          Built with ❤️ and precision.
        </p>
      </div>
    </Footer>
  );
};

export default AppFooter;
