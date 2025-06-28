import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Diamond, Users, RefreshCw, ArrowLeftRight } from 'lucide-react';

const promisesData = [
  {
    id: 1,
    icon: <RefreshCw size={48} />,
    title: "Guaranteed Buyback",
    description: "At any point of time if you feel you need to change the jewellery collections..."
  },
  {
    id: 2,
    icon: <Diamond size={48} />,
    title: "Tested & Certified Diamonds",
    description: "Every diamond pass through 28 internal quality tests with IGI- GIA..."
  },
  {
    id: 3,
    icon: <Users size={48} />,
    title: "Fair Labour Practices",
    description: "This exclusive feature gives complete flexibility to our customers..."
  },
  {
    id: 4,
    icon: <ArrowLeftRight size={48} />,
    title: "Easy Exchange",
    description: "This exclusive feature gives complete flexibility to our customers..."
  },
  {
    id: 5,
    icon: <Diamond size={48} />,
    title: "Quality Assured",
    description: "Every piece undergoes rigorous quality checks to ensure perfection..."
  }
];

export default function MalabarPromisesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Determine how many cards to show based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = promisesData.length - visibleCards;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleCards]);

  const handleNext = () => {
    const maxIndex = promisesData.length - visibleCards;
    setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handlePrev = () => {
    const maxIndex = promisesData.length - visibleCards;
    setCurrentIndex((prev) => prev <= 0 ? maxIndex : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    mainTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      margin: '0 0 0.5rem 0'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#7f8c8d',
      margin: '0'
    },
    carouselWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      position: 'relative'
    },
    leftSection: {
      flex: '0 0 400px',
      height: '500px',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#f8d7da',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    },
    personImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    rightSection: {
      flex: '1',
      position: 'relative',
      overflow: 'hidden',
      height: '500px', // Match the left section height
      display: 'flex',
      alignItems: 'center'
    },
    cardsContainer: {
      display: 'flex',
      transition: 'transform 0.5s ease-in-out',
      gap: '1.5rem',
      height: '100%',
      alignItems: 'center'
    },
    card: {
      flex: '0 0 calc(33.333% - 1rem)',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '3rem 2rem', // Increased padding
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      height: '450px', // Increased height to match left section
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardIcon: {
      color: '#d4af37',
      marginBottom: '2rem', // Increased margin
      display: 'flex',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: '1.5rem', // Increased font size
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '1.5rem', // Increased margin
      margin: '0 0 1.5rem 0'
    },
    cardDescription: {
      color: '#7f8c8d',
      lineHeight: '1.8', // Increased line height
      fontSize: '1.1rem' // Increased font size
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      border: '2px solid #e0e0e0',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      zIndex: '10',
      color: '#666'
    },
    prevButton: {
      left: '-25px'
    },
    nextButton: {
      right: '-25px'
    },
    indicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '2rem'
    },
    indicator: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    activeIndicator: {
      backgroundColor: '#d4af37'
    },
    inactiveIndicator: {
      backgroundColor: '#e0e0e0'
    }
  };

  const responsiveStyles = `
    @media (max-width: 1024px) {
      .carousel-wrapper {
        flex-direction: column !important;
        gap: 2rem !important;
      }
      
      .left-section {
        flex: 0 0 350px !important;
        width: 100% !important;
        max-width: 400px !important;
        margin: 0 auto !important;
        height: 350px !important;
      }
      
      .right-section {
        width: 100% !important;
        height: 350px !important;
      }
      
      .card {
        flex: 0 0 calc(50% - 0.75rem) !important;
        height: 320px !important;
        padding: 2rem 1.5rem !important;
      }
      
      .card-title {
        font-size: 1.3rem !important;
      }
      
      .card-description {
        font-size: 1rem !important;
      }
      
      .nav-button.prev {
        left: -20px !important;
      }
      
      .nav-button.next {
        right: -20px !important;
      }
    }
    
    @media (max-width: 640px) {
      .container {
        padding: 1rem 0.5rem !important;
      }
      
      .main-title {
        font-size: 2rem !important;
      }
      
      .left-section {
        height: 300px !important;
        flex: 0 0 300px !important;
      }
      
      .right-section {
        height: 300px !important;
      }
      
      .card {
        flex: 0 0 100% !important;
        padding: 2rem 1.5rem !important;
        height: 280px !important;
      }
      
      .card-title {
        font-size: 1.2rem !important;
        margin-bottom: 1rem !important;
      }
      
      .card-description {
        font-size: 0.95rem !important;
      }
      
      .nav-button {
        width: 40px !important;
        height: 40px !important;
      }
      
      .nav-button.prev {
        left: -15px !important;
      }
      
      .nav-button.next {
        right: -15px !important;
      }
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    }
    
    .nav-button:hover {
      background-color: #f8f9fa;
      border-color: #d4af37;
      color: #d4af37;
      transform: translateY(-50%) scale(1.1);
    }
    
    .indicator:hover {
      background-color: #d4af37 !important;
    }
  `;

  const maxIndex = promisesData.length - visibleCards;
  const totalDots = maxIndex + 1;

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={styles.container} className="container">
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle} className="main-title">Vimla Jewellers Promises</h1>
          <p style={styles.subtitle}>The promises that we'll never break</p>
        </div>

        {/* Main Carousel */}
        <div style={styles.carouselWrapper} className="carousel-wrapper">
          {/* Left Section - Person Image */}
          <div style={styles.leftSection} className="left-section">
            <img
              src="https://www.exus.co.uk/hs-fs/hubfs/exus-optimised/home/global-psychology-of-promises.webp?width=1234&height=600&name=global-psychology-of-promises.webp"
              alt="Brand Ambassador"
              style={styles.personImage}
            />
          </div>

          {/* Right Section - Promise Cards */}
          <div style={styles.rightSection} className="right-section">
            <div
              style={{
                ...styles.cardsContainer,
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`
              }}
            >
              {promisesData.map((promise) => (
                <div key={promise.id} style={styles.card} className="card">
                  <div style={styles.cardIcon}>
                    {promise.icon}
                  </div>
                  <h3 style={styles.cardTitle} className="card-title">
                    {promise.title}
                  </h3>
                  <p style={styles.cardDescription} className="card-description">
                    {promise.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              style={{...styles.navButton, ...styles.prevButton}}
              className="nav-button prev"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              style={{...styles.navButton, ...styles.nextButton}}
              className="nav-button next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div style={styles.indicators}>
          {Array.from({ length: totalDots }, (_, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 8000);
              }}
              style={{
                ...styles.indicator,
                ...(currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator)
              }}
              className="indicator"
            />
          ))}
        </div>
      </div>
    </>
  );
}
