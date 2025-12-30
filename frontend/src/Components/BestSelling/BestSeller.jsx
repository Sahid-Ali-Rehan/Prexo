import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Sparkles, 
  Crown,
  Eye,
  ShoppingBag,
  ArrowRight,
  Check,
  Clock,
  Smartphone,
  RefreshCw,
  Loader2,
  AlertCircle
} from "lucide-react";

// Register plugins
gsap.registerPlugin(ScrollTrigger);

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const fetchController = useRef(null);
  const navigate = useNavigate();

  // Fetch products function
  const fetchProducts = async (isRetry = false) => {
    if (isRetry) {
      setIsRetrying(true);
    }

    // Cancel previous fetch if exists
    if (fetchController.current) {
      fetchController.current.abort();
    }

    fetchController.current = new AbortController();
    
    try {
      const response = await fetch("https://prexo.onrender.com/api/products/fetch-products", {
        signal: fetchController.current.signal,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const bestSellers = data
          .filter(product => product?.isBestSeller === true)
          .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
          .slice(0, 20);
        
        setProducts(bestSellers);
        setHasError(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Fetch failed:", error);
        setHasError(true);
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
      fetchController.current = null;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
    
    // Cleanup on unmount
    return () => {
      if (fetchController.current) {
        fetchController.current.abort();
      }
    };
  }, []);

  // Load wishlist
  useEffect(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      setWishlist(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Wishlist parse error:", e);
    }
  }, []);

  // Setup animations when products load
  useEffect(() => {
    if (products.length === 0 || loading) return;

    // Kill existing triggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Animate cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: index * 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [products, loading]);

  const handleViewDetails = (productId) => {
    navigate(`/products/single/${productId}`);
  };

  const handleWishlist = (product) => {
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
      const exists = stored.some(item => item._id === product._id);
      const updated = exists
        ? stored.filter(item => item._id !== product._id)
        : [...stored, product];

      localStorage.setItem('wishlist', JSON.stringify(updated));
      setWishlist(updated);

      toast.success(`${product.productName} ${exists ? 'removed from' : 'added to'} wishlist`, {
        position: 'bottom-right',
        theme: 'light',
        autoClose: 1500,
      });
    } catch (e) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setHasError(false);
    setProducts([]);
    fetchProducts(true);
  };

  const getBrandColor = (productName) => {
    const name = productName?.toLowerCase() || '';
    if (name.includes('iphone') || name.includes('apple')) return '#007AFF';
    if (name.includes('samsung') || name.includes('galaxy')) return '#8B5CF6';
    if (name.includes('oneplus')) return '#F43F5E';
    if (name.includes('google') || name.includes('pixel')) return '#10B981';
    return '#000000';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-2 border-black/10 border-t-black/30 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-black/30" />
          </div>
        </div>
        <p className="text-black/50 text-sm font-light tracking-wide mb-2">
          Loading bestsellers...
        </p>
        {isRetrying && (
          <p className="text-black/30 text-xs">Retrying...</p>
        )}
      </div>
    );
  }

  // Error state
  if (hasError && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-black/30" />
        </div>
        <h3 className="text-xl font-light text-black mb-3" style={{ fontWeight: 300 }}>
          Failed to Load
        </h3>
        <p className="text-black/40 text-sm max-w-sm mb-6">
          The server is taking too long to respond. This is common with free hosting services.
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-black text-white text-sm font-light rounded-xl hover:bg-black/90 transition-all duration-200 flex items-center gap-2"
          style={{ fontWeight: 300 }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
        <p className="text-black/20 text-xs mt-4">
          Try refreshing the page if problem persists
        </p>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-white"
    >
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-black/10" />
            <span className="text-black/40 text-xs tracking-[0.3em] font-light uppercase">BESTSELLERS</span>
            <div className="w-8 h-px bg-black/10" />
          </div>

          <div className="overflow-hidden mb-4">
            <h1 
              className="text-5xl md:text-6xl font-thin tracking-[-0.05em] mb-2 text-black"
              style={{ 
                fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                fontWeight: 100
              }}
            >
              PREMIUM SELECTION
            </h1>
          </div>
          
          <p className="text-black/50 text-base max-w-xl mx-auto font-light tracking-wide leading-relaxed mb-8 uppercase tracking-[0.08em]">
            Curated excellence • Top rated • Customer favorite
          </p>
          
          {/* Retry button if empty */}
          {products.length === 0 && !loading && (
            <div className="mt-8">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-black text-white text-sm font-light rounded-xl hover:bg-black/90 transition-all duration-200 flex items-center gap-2 mx-auto"
                style={{ fontWeight: 300 }}
              >
                <RefreshCw className="w-4 h-4" />
                Load Products
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => {
            if (!product?._id) return null;
            
            const discountedPrice = product.discount 
              ? product.price - (product.price * product.discount) / 100 
              : product.price;
            
            const isInWishlist = wishlist.some(item => item._id === product._id);
            const brandColor = getBrandColor(product.productName);
            const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={product._id}
                ref={el => cardsRef.current[index] = el}
                className="group relative bg-white rounded-2xl border border-black/[0.08] hover:border-black/20 transition-all duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]"
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1.5 bg-black rounded-full">
                      <span className="flex items-center gap-1.5 text-xs font-light text-white tracking-wider">
                        <Crown className="w-3 h-3" />
                        BESTSELLER
                      </span>
                    </div>
                  </div>

                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-2.5 py-1 bg-rose-500 rounded-full">
                        <span className="text-xs font-light text-white">
                          -{product.discount}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product);
                    }}
                    className="absolute top-16 right-4 z-20 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all duration-300 border border-black/10 hover:border-black/20 hover:scale-110"
                  >
                    <FontAwesomeIcon
                      icon={isInWishlist ? solidHeart : regularHeart}
                      className={`text-sm ${isInWishlist ? 'text-rose-500' : 'text-black/40 group-hover:text-black/60'}`}
                    />
                  </button>

                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-b from-white via-gray-50 to-white">
                    <div className="relative h-full w-full flex items-center justify-center p-6">
                      <img
                        src={imageUrl}
                        alt={product.productName || 'Premium Smartphone'}
                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    {/* Quick View */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end pb-5">
                      <div className="w-full px-5">
                        <button
                          onClick={() => handleViewDetails(product._id)}
                          className="w-full py-2.5 bg-black text-white text-xs font-light rounded-xl hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-2 group/btn tracking-wider"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    {/* Title */}
                    <h3 
                      className="text-lg font-light text-black mb-2 tracking-tight"
                      style={{ fontWeight: 300 }}
                    >
                      {product.productName || 'Premium Device'}
                    </h3>
                    
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                      <span className="text-xs text-black/30 font-light tracking-wider">
                        {product.productName?.split(' ')[0] || 'Premium'}
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <div className="text-xl font-light text-black mb-1" style={{ fontWeight: 300 }}>
                          ৳{discountedPrice.toLocaleString()}
                        </div>
                        {product.discount > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-black/25 line-through text-xs">
                              ৳{product.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-emerald-600 font-light">
                              Save ৳{(product.price - discountedPrice).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Stock */}
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : product.stock > 0 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        <span className={`text-xs ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-rose-600'} font-light`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <button
                      onClick={() => handleViewDetails(product._id)}
                      disabled={!product.stock || product.stock === 0}
                      className={`w-full py-3 rounded-xl text-sm font-light transition-all duration-300 flex items-center justify-center gap-2 ${
                        !product.stock || product.stock === 0
                          ? 'bg-black/5 text-black/20 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-black/90'
                      }`}
                      style={{ fontWeight: 300 }}
                    >
                      {!product.stock || product.stock === 0 ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Bag
                        </>
                      )}
                    </button>
                    
                    {/* Delivery */}
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      <Check className="w-3 h-3 text-black/20" />
                      <span className="text-xs text-black/25 font-light tracking-wide">
                        Free shipping • 2-day delivery
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {products.length === 0 && !loading && !hasError && (
          <div className="text-center py-32">
            <div className="w-32 h-32 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-white to-white/50 border border-black/5 flex items-center justify-center">
              <Smartphone className="w-16 h-16 text-black/10" />
            </div>
            <h3 className="text-xl font-light text-black mb-3 tracking-tight" style={{ fontWeight: 300 }}>
              No Products Available
            </h3>
            <p className="text-black/30 max-w-sm mx-auto text-sm font-light tracking-wide mb-6">
              Check back soon for updates.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-black text-white text-sm font-light rounded-xl hover:bg-black/90 transition-all duration-200"
              style={{ fontWeight: 300 }}
            >
              Refresh Products
            </button>
          </div>
        )}

        {/* Footer */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-20 pt-12 border-t border-black/5"
          >
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-black text-white text-xs font-light rounded-xl hover:bg-black/90 transition-all duration-300 flex items-center gap-2 mx-auto tracking-wider"
              style={{ fontWeight: 300 }}
            >
              View All Products
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;