import React from 'react';
import HeroTitle from '../components/Basic/HeroSectionHead';
import CarouselLayout from '../components/Basic/CarouselLayout';
import TopCategories from '../components/Basic/TopCategories';
const Home = () => {
    return (
        <div>
            <HeroTitle />
            <CarouselLayout />
            <div className="bg-[#fdfdfd] py-8">

                <TopCategories />
            </div>
        </div>
    );
}

export default Home;
