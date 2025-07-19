import React from 'react';
import vmcImg from "../assets/catalogue/vmc.png"

function About() {
    return (
        <div className="bg-white text-gray-800 font-serif">
            {/* Header Section */}
            <div className="bg-yellow-50 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About Vimala Malai Centre</h1>
                <p className="text-lg max-w-3xl mx-auto">
                    Preserving the timeless elegance of Indian jewelry craftsmanship.
                </p>
            </div>

            {/* Image + Text Section */}
            <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
                <img
                    src={vmcImg} // Replace this with your image path
                    alt="Our Craft"
                    className="rounded-xl w-64 h-64 object-cover mx-auto"
                />
                <div>
                    <h2 className="text-3xl font-semibold mb-4">Our Legacy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        VMC (Vimala Malai Centre) was founded with a vision to bring the
                        brilliance of handcrafted jewelry to the modern world. With decades
                        of experience in goldsmithing and an eye for detail, our artisans
                        create pieces that celebrate both heritage and innovation.
                    </p>
                </div>
            </div>

            {/* Mission and Vision */}
            <div className="bg-yellow-100 py-12">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Our mission is to craft jewelry that resonates with emotion and
                        elegance. We envision a world where every VMC piece tells a unique
                        story — one of tradition, artistry, and unmatched craftsmanship.
                    </p>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl font-semibold mb-8">Why Choose VMC?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="shadow-lg p-6 rounded-xl bg-white">
                        <h3 className="font-bold text-xl mb-2">Authentic Craftsmanship</h3>
                        <p className="text-gray-600">Every product is made with passion and precision.</p>
                    </div>
                    <div className="shadow-lg p-6 rounded-xl bg-white">
                        <h3 className="font-bold text-xl mb-2">Pure Quality</h3>
                        <p className="text-gray-600">We use only certified gold and gemstones.</p>
                    </div>
                    <div className="shadow-lg p-6 rounded-xl bg-white">
                        <h3 className="font-bold text-xl mb-2">Trusted Since Generations</h3>
                        <p className="text-gray-600">Our customers are our family. We value trust and transparency.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
