import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import NewArrivals from "../components/home/NewArrivals";
import Testimonial from "../components/home/Testimonial";

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <CategorySection />
            <NewArrivals />
            <Testimonial />
        </>
    );
};

export default HomePage;