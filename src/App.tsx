import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategorySplit from './components/CategorySplit';
import EssentialsBanner from './components/EssentialsBanner';
import ProductSections from './components/ProductSections';
import Features from './components/Features';
import Footer from './components/Footer';
import { AppProvider, useAppContext } from './AppContext';
import Drawers from './components/Drawers';
import ProductPage from './components/ProductPage';
import CartFloatingBar from './components/CartFloatingBar';
import QuickAddDrawer from './components/QuickAddDrawer';

import NewArrivalsPage from './components/NewArrivalsPage';
import ShopAllPage from './components/ShopAllPage';
import MenWearPage from './components/MenWearPage';
import WomenWearPage from './components/WomenWearPage';
import SearchResultsPage from './components/SearchResultsPage';

function MainContent() {
  const { viewedProduct, currentView, isCartBarVisible, cart } = useAppContext();
  const showCartBar = isCartBarVisible && cart.length > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView, viewedProduct]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Drawers />
      <CartFloatingBar />
      <QuickAddDrawer />
      <div className={showCartBar ? "pb-20 md:pb-0" : ""}>
        <main>
          {viewedProduct ? (
            <ProductPage product={viewedProduct} />
          ) : currentView === 'new-arrivals' ? (
            <NewArrivalsPage />
          ) : currentView === 'men-wear' ? (
            <MenWearPage />
          ) : currentView === 'women-wear' ? (
            <WomenWearPage />
          ) : currentView === 'shop-all' ? (
            <ShopAllPage />
          ) : currentView === 'search-results' ? (
            <SearchResultsPage />
          ) : (
            <>
              <Hero />
              <CategorySplit />
              <EssentialsBanner />
              <ProductSections />
              <Features />
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
