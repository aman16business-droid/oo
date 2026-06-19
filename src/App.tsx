import { useAppContext } from './AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Drawers from './components/Drawers';
import QuickAddDrawer from './components/QuickAddDrawer';
import ProductPage from './components/ProductPage';
import Hero from './components/Hero';
import CategorySplit from './components/CategorySplit';
import ProductSections from './components/ProductSections';
import Features from './components/Features';
import RecentlyViewed from './components/RecentlyViewed';
import NewArrivalsPage from './components/NewArrivalsPage';
import ShopAllPage from './components/ShopAllPage';
import MenWearPage from './components/MenWearPage';
import WomenWearPage from './components/WomenWearPage';
import SearchResultsPage from './components/SearchResultsPage';
import PremiumPage from './components/PremiumPage';
import BestSellersPage from './components/BestSellersPage';
import CollectionPage from './components/CollectionPage';
import CartFloatingBar from './components/CartFloatingBar';

function App() {
  const { currentView, viewedProduct } = useAppContext();

  // If a product is being viewed, show the Product Detail Page regardless of currentView
  if (viewedProduct) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <ProductPage product={viewedProduct} />
        </main>
        <Footer />
        <Drawers />
        <QuickAddDrawer />
        <CartFloatingBar />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero />
            <CategorySplit />
            <ProductSections />
            <Features />
            <RecentlyViewed />
          </>
        );
      case 'new-arrivals':
        return <NewArrivalsPage />;
      case 'shop-all':
        return <ShopAllPage />;
      case 'men-wear':
        return <MenWearPage />;
      case 'women-wear':
        return <WomenWearPage />;
      case 'search-results':
        return <SearchResultsPage />;
      case 'premium':
        return <PremiumPage />;
      case 'best-sellers':
        return <BestSellersPage />;
      case 'collection':
        return <CollectionPage />;
      default:
        return (
          <>
            <Hero />
            <CategorySplit />
            <Features />
            <RecentlyViewed />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Header />
      <main>
        {renderView()}
      </main>
      <Footer />
      <Drawers />
      <QuickAddDrawer />
      <CartFloatingBar />
    </div>
  );
}

export default App;
