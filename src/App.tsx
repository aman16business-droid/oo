import React, { useLayoutEffect } from 'react';
import { useAppContext } from './AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Drawers from './components/Drawers';
import QuickAddDrawer from './components/QuickAddDrawer';
import CartFloatingBar from './components/CartFloatingBar';
import Chatbot from './components/Chatbot';
import AuthModal from './components/AuthModal';

// Active/Home Components
import Hero from './components/Hero';
import CategorySplit from './components/CategorySplit';
import ProductSections from './components/ProductSections';
import Features from './components/Features';
import RecentlyViewed from './components/RecentlyViewed';

// Lazy loaded pages
import ProductPage from './components/ProductPage';
import NewArrivalsPage from './components/NewArrivalsPage';
import ShopAllPage from './components/ShopAllPage';
import MenWearPage from './components/MenWearPage';
import WomenWearPage from './components/WomenWearPage';
import SearchResultsPage from './components/SearchResultsPage';
import PremiumPage from './components/PremiumPage';
import BestSellersPage from './components/BestSellersPage';
import CollectionPage from './components/CollectionPage';
import AccountPage from './components/AccountPage';
import TermsPage from './components/TermsPage';
import FAQPage from './components/FAQPage';
import PrivacyPage from './components/PrivacyPage';
import ShippingPolicyPage from './components/ShippingPolicyPage';
import ReturnPolicyPage from './components/ReturnPolicyPage';
import ExchangePolicyPage from './components/ExchangePolicyPage';
import PaymentPolicyPage from './components/PaymentPolicyPage';
import { ShopifyAnalyticsTracker } from './components/ShopifyAnalyticsTracker';

// Main Application Component
function App() {
  const { currentView, viewedProduct, shopId } = useAppContext();

  useLayoutEffect(() => {
    // Disable smooth scrolling temporarily for instant page transitions
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' } as ScrollToOptions);
    
    // Restore smooth scroll after a brief delay
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 50);
    return () => clearTimeout(timer);
  }, [currentView, viewedProduct]);

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
      case 'terms':
        return <TermsPage />;
      case 'faqs':
        return <FAQPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'shipping-policy':
        return <ShippingPolicyPage />;
      case 'return-policy':
        return <ReturnPolicyPage />;
      case 'exchange-policy':
        return <ExchangePolicyPage />;
      case 'payment-policy':
        return <PaymentPolicyPage />;
      case 'account' as any:
        return <AccountPage />;
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

  const Content = viewedProduct ? (
    <ProductPage product={viewedProduct} />
  ) : (
    renderView()
  );

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white overflow-x-clip relative w-full">
      <Header />
      <main>
          {Content}
      </main>
      <Footer />
      <Drawers />
      <QuickAddDrawer />
      <CartFloatingBar />
      <Chatbot />
      <AuthModal />
      <ShopifyAnalyticsTracker shopId={shopId} />
    </div>
  );
}

export default App;
