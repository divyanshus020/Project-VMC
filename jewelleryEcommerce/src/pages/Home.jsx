import React from 'react';
import HeroTitle from '../components/Basic/HeroSectionHead';
import CarouselLayout from '../components/Basic/CarouselLayout';
import TopCategories from '../components/Basic/TopCategories';
import OurPromises from '../components/Basic/OurPromises';
import CustomDesignSection from '../components/Basic/CustomDesignSection';
import RoyalVideoSection from '../components/Basic/RoyalVideoSection';
import TopPicksCarousel from '../components/Basic/TopPicksCarousel';
const Home = () => {
    return (
        <div>
            <HeroTitle />
            <CarouselLayout />
            <div className="bg-[#fdfdfd] py-8">

                <TopCategories />
                <RoyalVideoSection/>
                
                <OurPromises/>
                <CustomDesignSection/>
                <TopPicksCarousel/>
            </div>
        </div>
    );
}

export default Home;
