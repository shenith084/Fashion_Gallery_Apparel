# MASTER PROMPT
## Fashion Gallery Apparel ("My Moon Clothing") — Full-Stack E-Commerce System
### Public Website + Unified Real-Time Admin Panel (Role-Based Access: Admin & Staff) + Backend + API

| | |
|---|---|
| **Project Name** | Fashion Gallery Apparel (My Moon Clothing) |
| **Business Type** | Women's fashion / apparel — Moratuwa, Sri Lanka |
| **Prepared By** | Senith Chanidu (Group B) |
| **Assigned By** | Pixzora Lab |
| **Document Version** | v3.0 — Unified Admin Panel + Cloudinary Media |
| **Based On** | Project Research Document (30/06/2026) + Master Prompt v2.0 |
| **Date** | 01/07/2026 |

### What's New in This Version
This version updates v2.0 based on new client decisions:
1. **Unified admin structure** — one single Admin Panel (`/admin`), not two separate panels. The website itself and the admin panel are the only two top-level experiences. Inside the one Admin Panel, two roles exist — **Admin (Owner)** and **Staff** — and what each person sees is controlled entirely by role/permissions (conditional UI), not by separate routes or separate codebases.
2. **Admin can change staff permissions in real time**, from inside the same Admin Panel (no separate portal needed to manage this).
3. **Cloudinary replaces Firebase Storage** for all product photography and media assets. Firebase (Firestore + Auth) remains mandatory for the database and authentication, but image/video hosting, transformation, and optimization is handled by Cloudinary.
4. Brand identity, fixed color system, typography, and the global popup/notification system are carried over unchanged from v2.0.
5. Delivered as a single Markdown master prompt file.

---

## 0. ROLE DEFINITION (AI BEHAVIOR CONTRACT)

You are acting as a combined expert engineering team building this system for a real, currently-operating boutique that is transitioning off Facebook/WhatsApp-only sales:

- **Senior Software Architect** — system design, scalability, Next.js + Firebase + Cloudinary architecture
- **Senior Full-Stack Engineer** — implementation strategy (Next.js 14 App Router + Firebase + Cloudinary)
- **UI/UX Architect** — premium, light, feminine-professional fashion e-commerce design system
- **Firebase/Firestore Specialist** — real-time data, security rules, custom claims
- **Media/Cloudinary Specialist** — upload pipeline, transformations, responsive delivery, folder organization
- **Security Engineer** — RBAC, authentication, data protection
- **DevOps Engineer** — deployment, environments, monitoring

Do not propose a generic SaaS boilerplate. Every module, page, and permission below must map back to how this specific boutique actually operates (chat-based ordering, Cash on Delivery, Bank Transfer, an owner who currently does everything herself, and a small staff team that will need bounded access inside one shared admin tool).

---

## 1. CORE OBJECTIVE

Design a **production-grade, secure, mobile-first fashion e-commerce platform** that replaces manual Facebook/WhatsApp DM ordering with:

- A polished public storefront that looks at least as good as the brand's existing Facebook photography
- Cash on Delivery + Bank Transfer checkout (payment-gateway-ready for the future)
- **One Admin Panel** (`/admin`) shared by the Owner and Staff, where visible modules and actions adapt automatically to each person's role/permissions
- **Real-time** order, stock, and permission updates inside the panel — a permission change applies instantly without logout
- A **global popup/notification system** used on both the customer site and the admin panel
- **Cloudinary-hosted media** for fast, auto-optimized product photography

---

## 2. PROJECT INPUT CONFIGURATION (Client Context Snapshot)

| Attribute | Detail |
|---|---|
| Brand names in use | "Fashion Gallery Apparel" and "My Moon Clothing" — confirm final site name with owner |
| Location | Moratuwa, Sri Lanka (island-wide delivery) |
| Facebook presence | 9.6K followers, 1 following, active reels/photo posts, 2024 business award |
| Current ordering channel | Facebook Messenger + WhatsApp (076 416 5908), fully manual |
| Payment today | Cash on Delivery, Bank Transfer (manual confirmation) |
| Core pain points | No catalog, no stock tracking, no order history, no automated payment checks, invisible on Google |
| Target customer | Women, ~20–40, Sri Lanka-wide, mobile-first, values good photography and trust signals |
| Estimated SKUs | 40–60 items (to confirm exact count with owner) |
| Product attributes | Size, color, fabric, price, model size, stock count |

**Design implication:** the site must feel like a natural continuation of the existing Facebook shop — not a cold, generic template — while adding the structure (catalog, cart, accounts, one shared admin tool) the business currently lacks.

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architecture Style
**Modular Monolith** — Next.js 14 (App Router) handling both frontend and backend (Server Actions / Route Handlers), with **Firebase** (Mandatory) as the database and auth layer, and **Cloudinary** as the dedicated media layer.

*Justification:* This is a single-brand boutique with a small team, not a multi-tenant enterprise product. A modular monolith keeps deployment simple (single Vercel project), keeps cost low (fits Firebase's and Cloudinary's free/low tiers), and still enforces clean module boundaries (`/products`, `/orders`, `/staff`, `/notifications`) so it can be split into services later if the brand scales into multiple stores.

### 3.2 Layered Architecture
- **Presentation Layer** — Public site + one unified Admin Panel (role-adaptive UI, same codebase, same routes)
- **Application Layer** — Server Actions / API route handlers (cart, checkout, order status, staff permission changes, Cloudinary signed-upload requests)
- **Domain Layer** — Order workflow rules, stock rules, RBAC permission rules, notification rules
- **Data Layer** — Firestore (primary data), Firebase Auth (identity/roles), Cloudinary (all images/media — product photos, banners)

### 3.3 System Components
- Public Website (storefront)
- Guest checkout (no forced account creation — matches "as easy as chatting" expectation)
- **One Admin Panel** (`/admin`) — Owner and Staff log into the same panel; the interface adapts per role/permission (see Section 5)
- Real-Time Notification / Popup Engine (shared by customer site + admin panel, both roles)
- Marketing & Analytics Layer (Meta Pixel, TikTok Pixel, admin marketing dashboard)
- Media Manager (Cloudinary upload widget + transformation pipeline)
- Audit Log System
- Transactional Email Service (Resend)

---

## 4. PUBLIC WEBSITE (FRONTEND ARCHITECTURE)

### 4.1 Page Structure
| Page | Purpose |
|---|---|
| Home | Hero (brand photography), New Arrivals, Best Sellers, trust badges |
| Shop (All Products) | Filter by category, size, color; sort by new/price |
| Category pages | Maxi Dresses, Midi Dresses, Office Wear, Seasonal/Festive, New Arrivals |
| Product Detail | Photos, price, size/color selector, fabric info, model size, stock-aware "Add to Cart" |
| Cart | Editable quantities, subtotal, size/color shown per line |
| Checkout | Guest details, delivery address, COD or Bank Transfer, optional payment-proof upload |
| Order Confirmation / Tracking | Order number, status, WhatsApp fallback link |
| About Us | Brand story, 2024 award, follower/community trust signals |
| Wholesale Inquiry | Separate lightweight form → routes into its own admin queue |
| Policies | Delivery & Payment Policy, Return Policy, Size Guide |
| Contact | WhatsApp click-to-chat, phone, address, contact form |

### 4.2 Design System — Brand Identity

The existing Facebook logo ("My Moon" — a white crescent moon and heart mark on black, with deep red/maroon wordmark) already uses a burgundy-toned red. The primary palette below is a direct, more refined digital extension of that existing mark — so returning customers recognize the brand instantly.

#### 4.2.1 Primary Palette (Recommended — Light, Premium, Feminine-Professional)

| Color | Hex Code | Usage |
|---|---|---|
| Deep Burgundy | `#6B2335` | Logo, buttons, headings |
| Rose Gold | `#C89B7B` | Highlights, icons, accents |
| Warm Ivory | `#FAF8F5` | Main background |
| Soft Beige | `#F4EEE8` | Sections & cards |
| Charcoal | `#2B2B2B` | Body text |
| Luxury Gold | `#D4A373` | Premium accents (award badge, "New" tags) |

#### 4.2.2 Component-Level Color Mapping

**Header**
- Background: `#FAF8F5`
- Logo: `#6B2335`
- Menu Text: `#2B2B2B`

**Hero Section**
- Background: `#F4EEE8`
- Heading: `#6B2335`
- Button: `#6B2335`
- Button Hover: `#C89B7B`

**Product Cards**
- Background: `#FFFFFF`
- Price Color: `#6B2335`

**Footer**
- Background: `#2B2B2B`
- Text: `#FAF8F5`
- Links Hover: `#C89B7B`

#### 4.2.3 Premium Alternative Palette (Optional — Modern / Seasonal Theme)

| Color | Hex |
|---|---|
| Dark Plum | `#4A1F2D` |
| Dusty Rose | `#D8A7B1` |
| Champagne | `#F7E7CE` |
| Cream | `#FFFDF8` |
| Graphite | `#333333` |

*Recommended use:* keep the Primary Palette as the live production theme. Reserve the Premium Alternative as a theme-token swap for seasonal campaigns (e.g., festive collection launch) or a future rebrand — build the design system with CSS variables/tokens from day one so switching palettes is a configuration change, not a rebuild.

#### 4.2.4 Semantic / Status Colors (required for the popup system in Section 6)
The brand palette above covers identity but has no built-in success/error signaling. Add these as supporting tokens so notifications stay legible without breaking the brand feel:

| Status | Hex | Usage |
|---|---|---|
| Success | `#5C7A5C` (muted sage green) | Order placed, action completed |
| Warning | `#D4A373` (reuse Luxury Gold) | Low stock, pending confirmation |
| Error | `#A23B3B` (muted brick red) | Validation errors, failed actions |
| Info | `#6B8CAE` (muted slate blue) | Neutral system messages |

#### 4.2.5 Typography
- Headings: an elegant serif (e.g., Playfair Display or similar) — reinforces the "boutique/award-winning" positioning
- Body/UI: a clean sans-serif (e.g., Inter or similar) — keeps product info and checkout highly legible on mobile

#### 4.2.6 Layout Tokens
- 8px spacing grid
- Card radius: 12–16px (soft, boutique feel — not sharp corporate corners)
- Shadows: soft, low-opacity elevation only (avoid heavy drop shadows — keep it light and airy per the Warm Ivory background)

#### 4.2.7 Brand Asset Continuity
- Reuse the existing circular "My Moon" logo mark as the site favicon/header logo rather than redesigning it — the 9.6K existing followers already recognize it.
- Reuse top-performing Facebook photography (the multi-model banner style already in use) for the homepage hero and category headers instead of generic stock photography. Uploaded via the Cloudinary media pipeline (Section 5.7).
- Display the 2024 business award and follower count as trust badges near the hero/About section.

### 4.3 Responsive Design Rules
- Mobile-first (majority of traffic will be phone-based, per research doc)
- Tablet optimization for the Admin Panel specifically (owner/staff likely to check orders on tablet/phone too)
- Desktop enhancement for browsing/shop pages
- Flexible grid: 1 column (mobile) → 2 (tablet) → 3–4 (desktop) product grid

### 4.4 SEO Architecture
- Meta tag system, OpenGraph/Twitter cards (pulling Cloudinary-optimized product images automatically)
- `sitemap.xml`, `robots.txt`
- Schema.org `Product` and `LocalBusiness` structured data
- SEO-friendly URLs (`/shop/maxi-dresses/burgundy-wrap-dress`)
- Target keywords: **"Women's dress shop Sri Lanka"**, **"Fashion Gallery Apparel Moratuwa"**
- Target mobile PageSpeed score: **90+**

### 4.5 Trust & Social Proof
- 2024 business award badge
- "9.6K+ happy customers on Facebook" style social proof line
- Customer review section (start manually seeded from known repeat customers, expand via post-delivery review request email)

---

## 5. ADMIN PANEL ARCHITECTURE — ONE PANEL, ROLE-BASED ACCESS

This is the core of the updated requirements: **a single Admin Panel** at `/admin`, used by both the Owner and Staff. There is no second, separately-built portal — the panel itself reads the logged-in user's role/permissions and shows or hides modules, menu items, and actions accordingly. The public website is the only other top-level experience.

### 5.1 Access Model

| | Admin (Owner) | Staff |
|---|---|---|
| Route | `/admin` | `/admin` (same route, same app) |
| Who | Business owner | Employees hired to help with orders/stock |
| Auth | Firebase Auth + `role: admin` custom claim | Firebase Auth + `role: staff` custom claim |
| What they see | Full sidebar/menu — every module | Sidebar/menu filtered to only the modules and actions their `permissions` map grants |
| Access enforcement | Route guard (any authenticated `admin`/`staff` user may enter `/admin`) + per-module UI conditional rendering + Server Action permission checks + Firestore security rules (defense in depth, never UI-only) | Same enforcement stack, just with a smaller permission set |

**Why one panel instead of two:** the owner and staff are the same small team doing overlapping day-to-day work (orders, stock). One shared codebase/route with role-based conditional rendering is simpler to build, simpler to maintain, and still fully secure — because the real access control lives in Server Actions and Firestore Security Rules, not in which URL someone visits.

### 5.2 Admin Panel — Full Module List

| Module | Visible to Admin | Visible to Staff (default) | Notes |
|---|---|---|---|
| Dashboard | ✅ Full KPIs — revenue, order volume, conversion, live order feed | ✅ Restricted view — today's orders, low-stock list, tasks (no revenue/profit) | Same route, different content based on role |
| **Staff Management & Permissions** | ✅ Create/edit/deactivate staff accounts; toggle individual permissions in real time | ❌ Never visible to Staff | Hard-locked to Admin only |
| Product & Stock Management | ✅ Full CRUD, pricing, cost price (private), stock by size/color | ✅ Stock updates always; price/delete only if granted | Granular via permission toggles (5.4) |
| Order Management | ✅ Full order visibility including payment/financial detail | ✅ Confirm orders, update status, mark payment proof received (no cost price, no bank details unless granted) | |
| Customer & Wholesale Inquiries | ✅ Full customer history + wholesale pricing decisions | ✅ View/respond to inquiries; wholesale pricing decisions excluded unless granted | |
| Marketing Dashboard | ✅ Meta/TikTok pixel data, traffic-to-sale attribution | ❌ Hidden unless granted | |
| Settings | ✅ Bank account details, email templates, business info, theme, Cloudinary folder config | ❌ Hard-locked to Admin only | |
| Audit Log | ✅ Full visibility into every admin/staff action | ❌ Hard-locked to Admin only | |
| Media Manager | ✅ Upload, organize, optimize product photography via Cloudinary | ✅ Upload only if granted | |

Menu items a Staff member doesn't have permission for simply don't render — the panel never shows a greyed-out/locked item that hints at data they can't see.

### 5.3 Dynamic RBAC Permission Matrix

Format: `module.action`.

| Permission | Admin | Staff (default) | Toggleable by Admin? |
|---|---|---|---|
| `product.view` | ✅ | ✅ | — |
| `product.edit_details` | ✅ | ❌ | ✅ |
| `product.edit_price` | ✅ | ❌ | ✅ |
| `product.edit_stock` | ✅ | ✅ | ✅ |
| `product.delete` | ✅ | ❌ | ✅ |
| `order.view` | ✅ | ✅ | — |
| `order.view_financials` | ✅ | ❌ | ✅ |
| `order.update_status` | ✅ | ✅ | ✅ |
| `order.cancel` | ✅ | ❌ | ✅ |
| `customer.view` | ✅ | ✅ | — |
| `wholesale.view` | ✅ | ✅ | ✅ |
| `wholesale.manage_pricing` | ✅ | ❌ | ❌ (Admin only, hard-locked) |
| `staff.manage` | ✅ | ❌ | ❌ (Admin only, hard-locked) |
| `settings.manage` | ✅ | ❌ | ❌ (Admin only, hard-locked) |
| `reports.view_sales` | ✅ | ❌ | ✅ |
| `reports.view_marketing` | ✅ | ❌ | ❌ (Admin only, hard-locked) |
| `media.upload` | ✅ | ✅ | ✅ |
| `audit_log.view` | ✅ | ❌ | ❌ (Admin only, hard-locked) |

**Enforcement (defense in depth):**
1. UI hides any module/action the current user lacks permission for (inside the one shared panel)
2. Server Actions / route handlers re-check permission server-side before any write
3. Firestore Security Rules re-check the custom claim/permission map before any read/write — the client is never trusted

### 5.4 Real-Time Update Engine
- Firestore `onSnapshot` listeners power: live order feed, live stock counters, live "orders awaiting confirmation" badge count
- **Staff permission changes apply immediately, in the same session, without logout** — the client listens to its own `staff/{id}` document; the instant Admin toggles a permission, the Staff member's sidebar/menu re-renders inside the panel they're already using
- Optional: "staff currently online" presence indicator on the Admin dashboard

### 5.5 Audit Log Module
Tracks: staff created/edited/deactivated, permission changes, order status changes, price changes, product deletions, login/logout events. Admin only.

### 5.6 Media Manager (Cloudinary)
- Product images/video uploaded through a Cloudinary upload widget inside the Admin Panel (signed upload via a Server Action — the Cloudinary API secret never touches the client)
- Cloudinary auto-generates optimized formats (WebP/AVIF) and responsive breakpoints on delivery — no manual resizing needed
- Folder structure in Cloudinary mirrors product categories (e.g., `fashion-gallery/maxi-dresses/`, `fashion-gallery/office-wear/`)
- Firestore stores only the returned Cloudinary `public_id`/secure URL per image — Firestore never holds binary image data
- Reuse-across-products support (avoid re-uploading the same photo for a restocked color)
- `media.upload` permission (5.3) governs whether a given Staff member can upload; deleting a Cloudinary asset requires `product.delete` or `settings.manage`

---

## 6. POPUP / NOTIFICATION SYSTEM (GLOBAL SPEC)

One shared toast/notification engine, used across **two experiences**: the public site (customers) and the Admin Panel (both Admin and Staff, filtered by their permissions/audience). Non-blocking, corner-positioned toasts (not full-screen interruptive modals, except for critical confirmations like "delete product").

**Behavior rules:**
- Position: top-right on desktop, top-center on mobile
- Auto-dismiss after 4–6 seconds (except errors, which stay until dismissed)
- Stack up to 3 visible, queue the rest
- Clicking an admin-panel notification navigates to the relevant order/product
- Real-time triggers are pushed via Firestore listeners on a `notifications` collection scoped by audience/role

**Visual language:** built on the Semantic Colors from 4.2.4, with a left accent bar in the status color, on a Warm Ivory/white card — consistent with the storefront's light, premium feel rather than looking like a bolted-on generic alert.

| Trigger Event | Audience | Type | Example Message |
|---|---|---|---|
| Order placed successfully | Customer | Success | "Your order #FGA-1042 has been placed! We'll confirm shortly." |
| Item added to cart | Customer | Info | "Added to cart — Burgundy Wrap Dress (M)" |
| Selected size low in stock | Customer | Warning | "Only 2 left in size M — order soon!" |
| Checkout validation error | Customer | Error | "Please enter a valid phone number." |
| New order received | Admin Panel — anyone with `order.view` | Success | "New order #FGA-1042 — Rs. 4,500 (COD)" |
| Bank transfer proof uploaded | Admin Panel — anyone with `order.view_financials` | Info | "Payment proof uploaded for order #FGA-1039" |
| Stock below threshold | Admin Panel — anyone with `product.edit_stock` | Warning | "Low stock: Maxi Dress – Red, size L (2 left)" |
| Staff permission updated | The affected Staff member, inside the Admin Panel | Info | "Your access permissions were updated by Admin." |
| New staff account created | Admin | Success | "Staff account created for Nadeesha." |
| Wholesale inquiry submitted | Admin Panel — anyone with `wholesale.view` | Info | "New wholesale inquiry from Colombo Boutique." |
| Order cancelled/returned | Admin Panel — anyone with `order.view` | Warning | "Order #FGA-1030 marked as Returned." |

---

## 7. DATABASE ARCHITECTURE (Firebase Firestore — Mandatory)

### 7.1 Core Collections (sketch)

```
products/{productId}
  name, slug, categoryId, description
  images: [{ cloudinaryPublicId, secureUrl, alt }]
  fabric, modelSize
  variants: [{ size, color, stock, priceOverride? }]
  basePrice, status(active|hidden), createdAt, updatedAt
  private/financial (subcollection, Admin read only)
    costPrice, profitMargin

categories/{categoryId}
  name, parentCategory, slug, order

orders/{orderId}
  orderNumber, customer: { name, phone, address }
  items: [{ productId, size, color, qty, price }]
  subtotal, total
  paymentMethod: COD | BankTransfer
  paymentProofUrl?   (Cloudinary secure URL)
  status: Pending | Confirmed | Processing | Dispatched | Delivered | Cancelled | Returned
  statusHistory: [{ status, timestamp, byStaffId }]
  createdAt

customers/{customerId}
  name, phone, address, orderRefs[], createdAt

inquiries/{inquiryId}
  type: wholesale
  name, phone, message, status, createdAt

staff/{staffId}
  name, email, role: admin | staff
  permissions: { moduleAction: boolean, ... }
  active: boolean, lastLogin, createdBy

settings/business        (Admin read/write only — bank details, etc.)
settings/public           (public readable — about text, award info, theme)

auditLogs/{logId}
  actorId, actorRole, action, targetType, targetId, before, after, timestamp

notifications/{notificationId}
  audience: admin | staff | customerId
  type, title, message, read: boolean, link, createdAt
```

### 7.2 Rules
- 3NF-appropriate normalization, soft deletes on products/orders (never hard-delete order history)
- `createdAt`/`updatedAt` audit fields on every document
- Composite indexes on `orders(status, createdAt)` and `products(categoryId, status)` for fast filtered queries
- Firestore never stores image binaries — only Cloudinary `public_id`/secure URL references
- **Security Rules** enforce: public read on `products`/`categories`/`settings/public`; `orders` write restricted to server-side (Server Actions) only; `settings/business` and `products/*/private/*` readable only by `role == 'admin'`; `staff` collection writable only by `role == 'admin'`.

### 7.3 Seed System
- Default Admin account (owner)
- Default categories (Maxi, Midi, Office Wear, Seasonal/Festive, New Arrivals, Wholesale)
- Default permission templates for new staff
- Idempotent, safe to re-run, environment-based (never runs against production accidentally)

---

## 8. API / SERVER ACTIONS ARCHITECTURE

- Next.js 14 Server Actions for mutations (place order, update stock, change staff permission, request signed Cloudinary upload) — keeps sensitive logic server-side, never trusting the client
- Route Handlers (`/api/v1/...`) for anything needing a stable external contract (e.g., pixel-triggered events, webhook receivers)
- Standard response format:
```json
{ "success": true, "message": "", "data": {} }
```
- Centralized service layer — no direct third-party API calls from components; all Resend/Cloudinary/pixel/webhook calls go through a service abstraction with retry/fallback logic

---

## 9. THIRD-PARTY INTEGRATIONS

| Service | Purpose | Notes |
|---|---|---|
| **Cloudinary** | Product image/media hosting, transformation, optimization | Free tier is sufficient at 40–60 SKUs; signed uploads only, API secret stays server-side |
| **Resend** | Transactional email (order confirmation) | Free plan, integrates cleanly with Next.js |
| **Meta (Facebook) Pixel** | PageView, AddToCart, Purchase tracking | Ties web traffic back to existing FB audience |
| **TikTok Pixel** | Conversion tracking | Ready ahead of future TikTok ad spend |
| **WhatsApp Click-to-Chat** | Persistent fallback contact channel | Keeps the "easy as chatting" option customers already trust |
| **Payment Gateway (future)** | Not built now | `paymentMethod` stored as a simple enum field so a gateway like PayHere can be added later without restructuring orders |

---

## 10. SECURITY ARCHITECTURE

- Firebase Authentication + custom claims (`role`, `permissions`) for Admin/Staff — both authenticate into the same `/admin` app
- Firestore Security Rules as the source of truth for access control (never rely on UI hiding alone)
- Cloudinary uploads are **signed server-side** (Server Action generates a short-lived signature) — no unsigned/public upload presets, so only authenticated, permitted users can upload
- Input validation (e.g., zod schemas) on every Server Action
- Rate limiting on public-facing write endpoints (checkout, inquiry forms) to prevent spam orders
- Secure headers (CSP, HSTS) via Next.js/Vercel config
- Image upload validation (type/size limits) enforced before the signed Cloudinary upload is issued
- Password hashing handled by Firebase Auth; no custom credential storage

---

## 11. PERFORMANCE & SEO TARGETS

- Mobile PageSpeed score: **90+**
- `next-cloudinary` (or Cloudinary's Next.js SDK) for all product photography (auto WebP/AVIF, responsive sizes, CDN delivery)
- Lazy loading below the fold
- Vercel Edge CDN for static assets, Cloudinary CDN for all media
- Core keywords: "Women's dress shop Sri Lanka", "Fashion Gallery Apparel Moratuwa"

---

## 12. CODING STANDARDS & FOLDER STRUCTURE

```
/app
  /(storefront)
    /shop
    /product/[slug]
    /cart
    /checkout
    /about
    /wholesale
    /policies
    /contact
  /admin                → Single Admin Panel (route-guarded: role admin OR staff)
    /dashboard
    /staff              → menu item, visible to Admin only (staff.manage)
    /products
    /orders
    /marketing          → visible only if permission granted
    /settings           → Admin only
    /audit-log          → Admin only
  /api/v1
    /orders
    /cloudinary          → signed-upload endpoint
    /webhooks
/components
  /ui                 → shared design-system components (buttons, cards, toasts)
  /storefront
  /admin
/lib
  /firebase            → client + admin SDK setup
  /cloudinary           → signed upload helper, URL builder
  /services            → Resend, pixels, third-party abstraction layer
  /permissions          → RBAC helper functions (drives conditional rendering inside /admin)
/design-tokens          → color palettes (Primary + Premium Alternative), typography, spacing
```

**Standards:** camelCase for JS/TS variables, snake_case for Firestore field names where relational-style, kebab-case for URLs; no business logic inside route handlers (service layer only); DRY, SOLID, no duplicate logic.

---

## 13. DOCUMENTATION REQUIREMENTS

- `README.md` — setup, architecture overview
- Admin Panel User Guide — one guide covering both roles, with a clearly marked "Staff quick-reference" section for daily order/stock handling
- Deployment Guide
- `.env.example` (including Firebase + Cloudinary credentials)

---

## 14. DEVOPS & DEPLOYMENT

- Hosting: **Vercel** (natural fit for Next.js, generous free tier for this scale)
- Environments: separate Firebase projects and separate Cloudinary folders/presets for **development** and **production** (avoid testing against live customer/order data or live media)
- CI/CD: GitHub Actions → Vercel deploy on merge to `main`
- Backup: scheduled Firestore export (orders/customers are business-critical data)
- Monitoring: Vercel Analytics + basic error logging

---

## 15. IMPLEMENTATION ROADMAP

| Phase | Focus |
|---|---|
| 1 | Finalize pages, layout, and confirm brand palette with owner |
| 2 | Firebase setup — Firestore schema, Auth, security rules; Cloudinary account + folder/preset setup |
| 3 | Build storefront (Home, Shop, Product, Cart, Checkout) |
| 4 | Build unified Admin Panel (`/admin`) — Dashboard, Products, Orders, Staff Management & Permissions, Settings, Audit Log, all with role-based conditional rendering + RBAC enforcement |
| 5 | Real-time layer (order feed, stock counters, live permission updates, popup/notification engine) |
| 6 | Integrate Cloudinary media pipeline (signed uploads, transformations), Resend email, Meta/TikTok pixels |
| 7 | QA on mobile + desktop, PageSpeed tuning |
| 8 | Launch + owner/staff training on the shared Admin Panel |

---

## 16. FINAL OUTPUT REQUIREMENTS CHECKLIST

- [ ] System architecture diagram
- [ ] Firestore database schema
- [ ] API / Server Action structure
- [ ] RBAC permission matrix (Admin vs. Staff, inside one panel)
- [ ] Folder structure
- [ ] Unified Admin Panel module set with role-based visibility rules
- [ ] Public website pages
- [ ] Design system (Primary Palette + Premium Alternative + Semantic colors)
- [ ] Popup/notification system (customer + admin panel, both roles)
- [ ] Real-time engine spec (Firestore listeners, including instant permission updates)
- [ ] Security & Firestore rules plan
- [ ] Cloudinary media pipeline (signed uploads, folder structure, transformations)
- [ ] Performance/SEO plan
- [ ] DevOps/deployment plan
- [ ] Audit log design
- [ ] Seed system structure

---

## 17. OPEN QUESTIONS (Carried Over — Confirm With Owner Before Build)

- Should Bank Transfer require a payment-screenshot upload, or is a message enough?
- Exact current product/stock count?
- Does wholesale pricing need tiered/minimum order quantities?
- Final site name: "Fashion Gallery Apparel", "My Moon Clothing", or both?
- Target launch date?
- How many staff accounts should the system support at launch?
- Confirm Cloudinary account tier expectations (free tier bandwidth/storage limits at current photo volume)?
