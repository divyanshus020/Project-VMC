## ✨ Jewellery E-commerce Platform

A modern, responsive jewellery e-commerce website where users can browse and inquire about exquisite jewellery pieces. Admins can manage products and receive real-time notifications for product inquiries via dashboard alerts, email, and WhatsApp. Built with real-time technologies and Firebase authentication.

---

### 🚀 Features

* 🛍️ **Product Catalog**: Display all jewellery items with detailed information.
* 📏 **Image Scale Hover**: Interactive scale on image hover to visualize actual product size.
* 💬 **Reviews & Comments**: Users can write comments and reviews on products.
* 🛒 **Cart System**: Add products to a cart (without checkout).
* 🔔 **Inquiry System**: Users can inquire about a product, sending:

  * Real-time notification to admin dashboard (via Socket.IO)
  * Email alert
  * WhatsApp message
* 🌐 **Multi-language Support**: Language toggle for user-friendly experience.
* 🧑‍💼 **Admin Panel**:

  * Add/Edit/Delete Products
  * View inquiries in real-time
* 🔒 **Authentication**: Firebase Authentication for secure login/signup.
* 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop.

---

### 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS
* **Backend**: Node.js, Express.js, Socket.IO
* **Database**: MongoDB / Firestore (based on configuration)
* **Auth**: Firebase Authentication
* **Notifications**: Nodemailer (Email), Twilio / WhatsApp API
* **Deployment**: Vercel / Netlify (Frontend), Render / Railway / VPS (Backend)

---

### 📦 Installation

```bash
git clone https://github.com/divyanshus020/Project-VMC
cd jewelleryEcommerce
npm install
npm run dev
```

> Configure `.env` file with Firebase credentials, MongoDB URI, and notification settings.
