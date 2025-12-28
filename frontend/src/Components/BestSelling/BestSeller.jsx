import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Sparkles, 
  Award, 
  Star, 
  TrendingUp, 
  Shield,
  Zap,
  Camera,
  Battery,
  ChevronRight,
  Eye,
  ShoppingBag,
  ArrowRight,
  Check,
  Clock,
  BatteryCharging,
  Cpu,
  Radio,
  Smartphone,
  MoveRight,
  Sparkle,
  Crown,
  TrendingDown,
  Zap as Flash,
  Layers,
  Globe,
  Package,
  MousePointerClick
} from "lucide-react";

// Register plugins
gsap.registerPlugin(ScrollTrigger);

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  const categories = [
    { id: "all", label: "ALL PRODUCTS", icon: <Smartphone className="w-3 h-3" />, count: 42 },
    { id: "iphone", label: "IPHONE", count: 12 },
    { id: "samsung", label: "SAMSUNG", count: 8 },
    { id: "google", label: "PIXEL", count: 5 },
    { id: "oneplus", label: "ONEPLUS", count: 7 },
    { id: "premium", label: "PREMIUM", icon: <Crown className="w-3 h-3" />, count: 10 }
  ];

  const stats = [
    { label: "TOTAL RATING", value: "4.8/5.0", icon: <Star className="w-4 h-4" />, change: "+2.4%", color: "text-amber-500" },
    { label: "THIS MONTH", value: "1.2K+", icon: <TrendingUp className="w-4 h-4" />, change: "+18.2%", color: "text-emerald-500" },
    { label: "SATISFACTION", value: "98.7%", icon: <Award className="w-4 h-4" />, change: "+0.8%", color: "text-blue-500" },
    { label: "RETURN RATE", value: "0.8%", icon: <TrendingDown className="w-4 h-4" />, change: "-0.3%", color: "text-rose-500" }
  ];

  // Helper function to get subtle gradient based on brand
  const getBrandGradient = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('iphone') || name.includes('apple')) {
      return "from-blue-500/5 via-blue-400/2 to-blue-500/5";
    } else if (name.includes('samsung') || name.includes('galaxy')) {
      return "from-purple-500/5 via-purple-400/2 to-purple-500/5";
    } else if (name.includes('oneplus')) {
      return "from-rose-500/5 via-rose-400/2 to-rose-500/5";
    } else if (name.includes('google') || name.includes('pixel')) {
      return "from-emerald-500/5 via-emerald-400/2 to-emerald-500/5";
    }
    return "from-gray-500/5 via-gray-400/2 to-gray-500/5";
  };

  // Get brand accent color
  const getBrandColor = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes('iphone') || name.includes('apple')) return '#007AFF';
    if (name.includes('samsung') || name.includes('galaxy')) return '#8B5CF6';
    if (name.includes('oneplus')) return '#F43F5E';
    if (name.includes('google') || name.includes('pixel')) return '#10B981';
    return '#000000';
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://prexo.onrender.com/api/products/fetch-products");
        const data = await response.json();
        const bestSellers = data
          .filter(product => product.isBestSeller === true)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 20);
        setProducts(bestSellers);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    if (!products.length) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Apple-style staggered animations
    gsap.fromTo(
      ".stat-item",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      }
    );

    // Floating 3D card animations
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          rotationX: 15,
          rotationY: -5,
          duration: 1,
          delay: index * 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });

        // 3D hover effect
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            rotationX: -2,
            rotationY: 2,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.02)'
          });
        });
      }
    });

    // Floating sparkle animations
    gsap.to(".floating-sparkle", {
      y: -20,
      rotation: 180,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [products]);

  const handleViewDetails = (productId) => {
    navigate(`/products/single/${productId}`);
  };

  const handleWishlist = (product) => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = storedWishlist.some(item => item._id === product._id);
    const updatedWishlist = exists
      ? storedWishlist.filter(item => item._id !== product._id)
      : [...storedWishlist, product];

    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);

    toast.success(`${product.productName} ${exists ? 'removed from' : 'added to'} wishlist`, {
      position: 'bottom-right',
      theme: 'light',
      autoClose: 1500,
      hideProgressBar: true,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        color: '#000',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: '300'
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-[1.5px] border-black/5 border-t-black/20 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkle className="w-8 h-8 text-black/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-white via-white to-gray-50 overflow-hidden"
    >
      {/* Ultra-subtle background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.01)_25%,rgba(0,0,0,0.01)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.01)_75%,rgba(0,0,0,0.01)_100%)] bg-[size:20px_20px] opacity-[0.02]" />
      
      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-sparkle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkle className="w-4 h-4 text-black/[0.03]" />
          </div>
        ))}
      </div>

      {/* Ultra-thin grid lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="container mx-auto h-full relative">
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-black/[0.02] to-transparent" />
          <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-black/[0.01] to-transparent" />
          <div className="absolute left-2/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-black/[0.01] to-transparent" />
          <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-black/[0.01] to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-black/[0.02] to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Apple-style ultra-minimalist header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-6 h-px bg-black/10" />
            <span className="text-black/40 text-[11px] tracking-[0.4em] font-light uppercase">CURATED SELECTION</span>
            <div className="w-6 h-px bg-black/10" />
          </motion.div>

          <div className="overflow-hidden mb-4">
            <h1 
              ref={titleRef}
              className="text-[5.5rem] md:text-[6.5rem] font-thin tracking-[-0.04em] mb-2 text-black"
              style={{ 
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 100,
                letterSpacing: '-0.05em'
              }}
            >
              BESTSELLERS
            </h1>
          </div>
          
          <p className="text-black/60 text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed mb-12 uppercase tracking-[0.1em]">
            Exceptional devices • Proven performance • Customer favorite
          </p>

          {/* Stats bar - Apple watch style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-black/5 hover:border-black/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${stat.color} p-2 rounded-full bg-black/5`}>
                      {stat.icon}
                    </div>
                    <span className="text-xs text-black/40 font-medium">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-light text-black mb-1">{stat.value}</div>
                  <div className="text-xs text-black/30 uppercase tracking-wider">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category filter - Apple tab style */}
          <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-3xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative px-5 py-2.5 rounded-full text-xs transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black/60 hover:text-black border border-black/10 hover:border-black/20'
                }`}
              >
                {category.icon}
                <span className="font-medium tracking-wider">{category.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === category.id 
                    ? 'bg-white/20 text-white/90' 
                    : 'bg-black/5 text-black/40'
                }`}>
                  {category.count}
                </span>
                
                {/* Hover underline effect */}
                <div className={`absolute bottom-0 left-4 right-4 h-px bg-black/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                  activeCategory === category.id ? 'hidden' : ''
                }`} />
              </button>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, index) => {
              const discountedPrice = product.discount 
                ? product.price - (product.price * product.discount) / 100 
                : product.price;
              
              const isInWishlist = wishlist.some(item => item._id === product._id);
              const brandGradient = getBrandGradient(product.productName);
              const brandColor = getBrandColor(product.productName);

              return (
                <div
                  key={product._id}
                  ref={el => cardsRef.current[index] = el}
                  className="product-card group relative"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* 3D Card with glass morphism */}
                  <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.08] transition-all duration-500 group-hover:border-black/20 group-hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)]">
                    {/* Subtle brand gradient overlay */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${brandGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    
                    {/* Floating 3D effect layer */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]" />
                    
                    {/* Cute corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-black/5 to-transparent transform rotate-45 translate-x-8 -translate-y-8" />
                    </div>

                    {/* Image container with 3D depth */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.2)_1px,transparent_0)] bg-[size:40px_40px]" />
                      
                      {/* Main product image with 3D reflection */}
                      <div className="relative h-full w-full flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4">
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                            alt={product.productName}
                            className="product-image w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ 
                              transformStyle: 'preserve-3d',
                              transformOrigin: 'center center'
                            }}
                          />
                          
                          {/* Reflection effect */}
                          <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                        </div>
                      </div>
                      
                      {/* Floating badges with 3D effect */}
                      <div className="absolute top-4 left-4 z-20 space-y-2">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-black to-black/90 backdrop-blur-sm rounded-xl text-xs font-light text-white tracking-wider shadow-lg">
                          <span className="flex items-center gap-1.5">
                            <Crown className="w-3 h-3" />
                            BESTSELLER
                          </span>
                        </div>
                        
                        {product.discount > 0 && (
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                            className="px-3 py-1 bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl text-xs font-light text-white shadow-lg"
                          >
                            -{product.discount}%
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Premium wishlist button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(product);
                        }}
                        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-300 border border-black/5 hover:border-black/20 hover:scale-110 shadow-md"
                      >
                        <FontAwesomeIcon
                          icon={isInWishlist ? solidHeart : regularHeart}
                          className={`text-sm ${isInWishlist ? 'text-rose-500' : 'text-black/40 group-hover:text-black/60'}`}
                        />
                      </button>
                      
                      {/* Hover overlay with quick view */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-end pb-6">
                        <div className="w-full px-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <button
                            onClick={() => handleViewDetails(product._id)}
                            className="w-full py-2.5 bg-black text-white text-xs font-light rounded-xl hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-2 group/btn tracking-wider uppercase"
                          >
                            <Eye className="w-3 h-3" />
                            Quick View
                            <MoveRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="p-5 relative z-20">
                      {/* Product title with thin font */}
                      <h3 className="text-lg font-light text-black mb-1.5 tracking-tight uppercase" style={{ fontWeight: 300 }}>
                        {product.productName}
                      </h3>
                      
                      {/* Brand tag */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                        <span className="text-xs text-black/30 font-medium tracking-wider uppercase">
                          {product.productName.split(' ')[0]}
                        </span>
                      </div>
                      
                      {/* Subtle description */}
                      <p className="text-black/40 text-xs font-light mb-4 line-clamp-2 tracking-wide">
                        {product.description || "Premium smartphone with cutting-edge technology and superior performance."}
                      </p>
                      
                      {/* Price and stock */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                          <div className="text-2xl font-light text-black" style={{ fontWeight: 300 }}>
                            ৳{discountedPrice.toLocaleString()}
                          </div>
                          {product.discount > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-black/25 line-through text-sm">
                                ৳{product.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-emerald-600">
                                Save ৳{(product.price - discountedPrice).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Stock indicator */}
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                          <span className={`text-xs ${product.stock > 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Key features - minimal dots */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 text-black/30">
                          <Camera className="w-3 h-3" />
                          <span className="text-xs">Pro</span>
                        </div>
                        <div className="w-px h-3 bg-black/10" />
                        <div className="flex items-center gap-1 text-black/30">
                          <Zap className="w-3 h-3" />
                          <span className="text-xs">Fast</span>
                        </div>
                        <div className="w-px h-3 bg-black/10" />
                        <div className="flex items-center gap-1 text-black/30">
                          <Battery className="w-3 h-3" />
                          <span className="text-xs">Long</span>
                        </div>
                      </div>
                      
                      {/* Primary CTA */}
                      <button
                        onClick={() => handleViewDetails(product._id)}
                        disabled={product.stock === 0}
                        className={`w-full py-3 rounded-xl text-xs font-light transition-all duration-300 flex items-center justify-center gap-2 group/cta tracking-wider uppercase ${
                          product.stock === 0
                            ? 'bg-black/5 text-black/20 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-black/90 border border-black hover:shadow-md'
                        }`}
                        style={{ fontWeight: 300 }}
                      >
                        {product.stock === 0 ? (
                          <>
                            <Clock className="w-3 h-3" />
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            Add to Bag
                            <MousePointerClick className="w-3 h-3 opacity-0 group-hover/cta:opacity-100 transition-opacity" />
                          </>
                        )}
                      </button>
                      
                      {/* Express delivery badge */}
                      <div className="mt-3 flex items-center justify-center gap-1.5">
                        <Check className="w-3 h-3 text-black/20" />
                        <span className="text-xs text-black/25 tracking-wide">Free shipping • 2-day delivery</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Outer 3D shadow effect */}
                  <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 blur-xl" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-40">
            <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-white to-white/50 border border-black/5 flex items-center justify-center">
              <div className="relative">
                <Package className="w-16 h-16 text-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkle className="w-8 h-8 text-black/20 animate-pulse" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-light text-black mb-3 tracking-tight uppercase" style={{ fontWeight: 300 }}>
              Curating Excellence
            </h3>
            <p className="text-black/30 max-w-sm mx-auto text-sm font-light tracking-wide">
              Our premium selection is being prepared with utmost care. Experience unparalleled innovation soon.
            </p>
          </div>
        )}

        {/* Apple-style minimalist CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-32 pt-20 border-t border-black/5"
        >
          <div className="inline-flex items-center gap-3 text-black/20 text-xs tracking-[0.3em] uppercase mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            DISCOVER MORE
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </div>
          <h3 className="text-3xl font-light text-black mb-4 tracking-tight" style={{ fontWeight: 300 }}>
            Experience the Difference
          </h3>
          <p className="text-black/40 text-sm max-w-md mx-auto mb-8 font-light tracking-wide leading-relaxed">
            Each device is carefully selected to deliver exceptional performance, stunning design, and lasting value.
          </p>
          <button className="px-8 py-3 bg-black text-white text-xs font-light rounded-xl hover:bg-black/90 transition-all duration-300 flex items-center gap-2 mx-auto group/explore tracking-wider uppercase">
            View Complete Collection
            <MoveRight className="w-3 h-3 group-hover/explore:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Ultra-thin bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />
    </section>
  );
};

export default BestSellers;