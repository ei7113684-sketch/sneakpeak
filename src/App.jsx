
import { useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Air Motion 01",
    category: "Running",
    price: 3499,
    oldPrice: 4200,
    color: "White / Orange",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    badge: "BEST SELLER",
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 2,
    name: "Street Classic",
    category: "Lifestyle",
    price: 2899,
    oldPrice: null,
    color: "Black / White",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    badge: "NEW",
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 3,
    name: "Cloud Runner",
    category: "Running",
    price: 3799,
    oldPrice: null,
    color: "Grey / White",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=85",
    badge: "",
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 4,
    name: "Court Vision",
    category: "Lifestyle",
    price: 3199,
    oldPrice: 3599,
    color: "Cream / Green",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85",
    badge: "SALE",
    sizes: [39, 40, 41, 42, 43, 44],
  },
];

const categories = ["All", "Running", "Lifestyle"];

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    city: "Alexandria",
    address: "",
    notes: "",
  });
  

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
  const cartKey =
    product.cartKey ?? `${product.id}-${product.selectedSize ?? "one-size"}`;

  setCart((currentCart) => {
    const existingItem = currentCart.find(
      (item) => item.cartKey === cartKey
    );

    if (existingItem) {
      return currentCart.map((item) =>
        item.cartKey === cartKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...currentCart,
      {
        ...product,
        cartKey,
        quantity: 1,
      },
    ];
  });
};
  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const updateQuantity = (cartKey, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartKey) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.cartKey !== cartKey),
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shippingFee = cartTotal >= 5000 || cartTotal === 0 ? 0 : 75;
  const checkoutTotal = cartTotal + shippingFee;

  const handleCustomerChange = (event) => {
    const { name, value } = event.target;
    setCustomer((current) => ({ ...current, [name]: value }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    setCheckoutError("");

    if (cart.length === 0) {
      setCheckoutError("Your bag is empty. Add a product before checkout.");
      return;
    }

    const normalizedPhone = customer.phone.replace(/[\s()-]/g, "");
    const egyptianPhone = /^(?:\+20|0020|0)?1[0125][0-9]{8}$/;

    if (!egyptianPhone.test(normalizedPhone)) {
      setCheckoutError("Enter a valid Egyptian mobile number, such as 01012345678.");
      return;
    }

    // Front-end demo only: never collect or store card numbers, CVV, or PINs here.
    // A real order must be validated and created by a trusted backend.
    const order = {
      demoOrderNumber: `SP-DEMO-${Date.now().toString().slice(-6)}`,
      customer: { ...customer, phone: normalizedPhone },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.selectedSize ?? null,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      subtotal: cartTotal,
      shipping: shippingFee,
      total: checkoutTotal,
      paymentMethod: "Cash on delivery",
    };

    setOrderConfirmation(order);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  return (
    <div className="app">
      <div className="announcement">
        FREE SHIPPING ON ORDERS OVER 5,000 EGP
      </div>

      <header className="navbar">
        <a className="logo" href="#home">
          SNEAK<span>PEAK.</span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#about">Our Story</a>
        </nav>

        <div className="nav-actions">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search sneakers..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                document.getElementById("shop")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              aria-label="Search sneakers"
            />
          </label>

          <button
            className="cart-button"
            onClick={() => setCartOpen(true)}
          >
            Bag <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">THE NEW SEASON / 2026</span>
            <h1>
              Find Your
              <br />
              <span>Next Step.</span>
            </h1>
            <p>
              Sneakers that move with you. Discover your next everyday
              essential, designed for comfort and made for the streets.
            </p>
            <a href="#shop" className="primary-button">
              Explore Collection <span>↗</span>
            </a>

            <div className="hero-stats">
              <div>
                <strong>20+</strong>
                <span>Styles</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Style</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>For you</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=90"
                alt="Featured sneaker from the new collection"
              />
            </div>
            <div className="floating-label">
              <span className="floating-dot" />
              STEP INTO SOMETHING NEW
            </div>
            <div className="hero-number">01 / 04</div>
          </div>
        </section>

        <section className="benefits">
          <div><span>↗</span> FREE SHIPPING OVER 5,000 EGP</div>
          <div><span>◇</span> QUALITY YOU CAN FEEL</div>
          <div><span>↺</span> EASY 14-DAY RETURNS</div>
        </section>

        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CURATED FOR YOU</span>
              <h2>Trending <span>Now.</span></h2>
            </div>
            <p>
              Everyday icons. Fresh silhouettes.
              <br />
              Find the pair that feels like you.
            </p>
          </div>

          <div className="shop-toolbar">
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className="product-count">
              {filteredProducts.length} PRODUCTS
            </span>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />

                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}

                  <button
                    className={
                      favorites.includes(product.id)
                        ? "favorite-button favorited"
                        : "favorite-button"
                    }
                    onClick={() => toggleFavorite(product.id)}
                    aria-label={
                      favorites.includes(product.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favorites.includes(product.id) ? "♥" : "♡"}
                  </button>

                  <button
                    className="quick-add"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(null);
                    }}
                  >
                    + SELECT SIZE
                  </button>
                </div>
                 <button
                       className="details-button"
                        onClick={() => {
                      setSelectedProduct(product);
                      setSelectedSize(null);
                               }}
                                                    >
                VIEW DETAILS ↗
                </button>
                <div className="product-info">
                  <div className="product-title-row">
                    <h3>{product.name}</h3>
                    <span className="product-category">{product.category}</span>
                  </div>
                  <p>{product.color}</p>
                  <div className="price-row">
                    <strong>{product.price.toLocaleString("en-US")} EGP</strong>
                    {product.oldPrice && (
                      <del>{product.oldPrice.toLocaleString("en-US")} EGP</del>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No sneakers found.</h3>
              <p>Try another search or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="about">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1520256862855-398228c41684?auto=format&fit=crop&w=1000&q=85"
              alt="Sneakers and streetwear inspiration"
              loading="lazy"
            />
          </div>
          <div className="story-content">
            <span className="eyebrow">MORE THAN A SHOE</span>
            <h2>
              Your style.
              <br />
              <span>Your pace.</span>
            </h2>
            <p>
              We believe the right pair can change how you move through your
              day. SneakPeak is about finding your style, owning your pace,
              and taking the next step with confidence.
            </p>
            <a className="text-link" href="#shop">
              FIND YOUR PAIR <span>↗</span>
            </a>
          </div>
        </section>
      </main>
 {selectedProduct && (
  <div
    className="modal-backdrop"
    onClick={() => setSelectedProduct(null)}
  >
    <section
      className="product-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setSelectedProduct(null)}
        aria-label="Close product details"
      >
        ×
      </button>

      <img
        className="modal-image"
        src={selectedProduct.image}
        alt={selectedProduct.name}
      />

      <div className="modal-content">
        <span className="eyebrow">{selectedProduct.category}</span>
        <h2 id="product-modal-title">{selectedProduct.name}</h2>
        <p>{selectedProduct.color}</p>

        <strong className="modal-price">
          {selectedProduct.price.toLocaleString("en-US")} EGP
        </strong>

        <h4>Select your size (EU)</h4>

        <div className="size-options">
          {selectedProduct.sizes.map((size) => (
            <button
              key={size}
              className={
                selectedSize === size ? "size-button selected" : "size-button"
              }
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          className="modal-add-button"
          onClick={() => {
            if (selectedSize === null) {
              alert("Please select a shoe size first.");
              return;
            }

            addToCart({
              ...selectedProduct,
              cartKey: `${selectedProduct.id}-${selectedSize}`,
              selectedSize,
            });

            setSelectedProduct(null);
            setCartOpen(true);
          }}
        >
          ADD TO BAG — {selectedProduct.price.toLocaleString("en-US")} EGP
            </button>
            </div>
             </section>
              </div>
                   )}
      {cartOpen && (
        <div
          className="cart-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR SELECTION</span>
                <h2>Your Bag ({cartCount})</h2>
              </div>
              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <h3>Your bag is empty.</h3>
                <p>Find your next favorite pair.</p>
                <button
                  className="modal-add-button"
                  onClick={() => setCartOpen(false)}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.cartKey}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{item.color}</p>
                        {item.selectedSize != null && (
                          <p>Size: EU {item.selectedSize}</p>
                        )}
                        <strong>
                          {(item.price * item.quantity).toLocaleString("en-US")} EGP
                        </strong>
                        <div className="cart-item-actions">
                          <div className="quantity-control">
                            <button
                              onClick={() => updateQuantity(item.cartKey, -1)}
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartKey, 1)}
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-item"
                            onClick={() => removeFromCart(item.cartKey)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <strong>{cartTotal.toLocaleString("en-US")} EGP</strong>
                  </div>
                  <p>Shipping and delivery are calculated at checkout.</p>
                  <button
                    className="modal-add-button"
                    onClick={() => {
                      setCheckoutError("");
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}


      {checkoutOpen && (
        <div className="checkout-backdrop" onClick={() => setCheckoutOpen(false)}>
          <section
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="checkout-heading">
              <div>
                <span className="eyebrow">ALMOST YOURS</span>
                <h2 id="checkout-title">Checkout</h2>
                <p>Enter delivery details to place your demo order.</p>
              </div>
              <button
                className="cart-close"
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close checkout"
              >
                ×
              </button>
            </div>

            <div className="checkout-security-note" role="note">
              <strong>Secure demo checkout</strong>
              <span>Cash on delivery only. We never ask for card numbers, CVV, PINs, or banking passwords on this page.</span>
            </div>

            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <label>
                Full name
                <input
                  name="fullName"
                  autoComplete="name"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Egyptian mobile number
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  required
                  maxLength={20}
                  placeholder="01012345678"
                  aria-describedby="phone-help"
                />
                <small id="phone-help">Used for delivery coordination in this demo.</small>
              </label>

              <label>
                City
                <select name="city" value={customer.city} onChange={handleCustomerChange} required>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Delivery address
                <textarea
                  name="address"
                  autoComplete="street-address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  required
                  minLength={8}
                  maxLength={250}
                  rows={3}
                  placeholder="Street, building, floor, apartment..."
                />
              </label>

              <label>
                Delivery notes <span className="optional-label">(optional)</span>
                <textarea
                  name="notes"
                  value={customer.notes}
                  onChange={handleCustomerChange}
                  maxLength={300}
                  rows={2}
                  placeholder="Anything the courier should know?"
                />
              </label>

              <div className="payment-choice">
                <span className="payment-choice-icon" aria-hidden="true">✓</span>
                <div>
                  <strong>Cash on delivery</strong>
                  <p>Pay the courier when your order arrives.</p>
                </div>
                <span className="payment-selected">SELECTED</span>
              </div>

              <div className="checkout-summary">
                <div><span>Subtotal</span><strong>{cartTotal.toLocaleString("en-US")} EGP</strong></div>
                <div><span>Shipping</span><strong>{shippingFee === 0 ? "FREE" : `${shippingFee.toLocaleString("en-US")} EGP`}</strong></div>
                <div className="checkout-grand-total"><span>Total</span><strong>{checkoutTotal.toLocaleString("en-US")} EGP</strong></div>
              </div>

              {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}

              <button className="modal-add-button checkout-submit" type="submit">
                PLACE DEMO ORDER — {checkoutTotal.toLocaleString("en-US")} EGP
              </button>
              <p className="checkout-disclaimer">Portfolio demo only. This page does not submit an order to a server or process a payment.</p>
            </form>
          </section>
        </div>
      )}

      {orderConfirmation && (
        <div className="checkout-backdrop" onClick={() => setOrderConfirmation(null)}>
          <section
            className="order-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="success-check" aria-hidden="true">✓</div>
            <span className="eyebrow">DEMO ORDER COMPLETE</span>
            <h2 id="order-success-title">Thanks, {orderConfirmation.customer.fullName.split(" ")[0]}!</h2>
            <p>Your demo order has been prepared locally. No real order or payment was sent.</p>
            <div className="order-reference">
              <span>Demo reference</span>
              <strong>{orderConfirmation.demoOrderNumber}</strong>
            </div>
            <div className="checkout-summary confirmation-summary">
              <div><span>Items</span><strong>{orderConfirmation.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
              <div><span>Payment</span><strong>Cash on delivery</strong></div>
              <div><span>Delivery city</span><strong>{orderConfirmation.customer.city}</strong></div>
              <div className="checkout-grand-total"><span>Total</span><strong>{orderConfirmation.total.toLocaleString("en-US")} EGP</strong></div>
            </div>
            <button className="modal-add-button" onClick={() => setOrderConfirmation(null)}>CONTINUE SHOPPING</button>
          </section>
        </div>
      )}

      <footer className="footer">
        <a className="logo footer-logo" href="#home">
          SNEAK<span>PEAK.</span>
        </a>
        <p>Find your next step.</p>
        <span>© 2026 SneakPeak. Portfolio demo project.</span>
      </footer>
    </div>
  );
}

export default App;
