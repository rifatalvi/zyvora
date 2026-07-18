- `[x]` **Phase 1: Initial Setup**
  - `[x]` Initialize Next.js in `c:\Agentic_Ai\zyvora` (TypeScript, Tailwind).
  - `[x]` Initialize Node.js/Express in `c:\Agentic_Ai\zyvora-server` (TypeScript setup).
  - `[x]` Install essential frontend dependencies.
  - `[x]` Install essential backend dependencies.

- `[x]` **Phase 2: Database & Backend Auth**
  - `[x]` Setup MongoDB connection in the backend.
  - `[x]` Create User Mongoose schema.
  - `[x]` Create authentication utility functions.
  - `[x]` Create POST /api/auth/register endpoint.
  - `[x]` Create POST /api/auth/login endpoint.

- `[x]` **Phase 3: Backend API (Items/Courses)**
  - `[x]` Create Item Mongoose schema.
  - `[x]` Create authentication middleware.
  - `[x]` Create POST /api/items endpoint.
  - `[x]` Create GET /api/items endpoint.
  - `[x]` Create GET /api/items/:id endpoint.
  - `[x]` Create DELETE /api/items/:id endpoint.

- `[x]` **Phase 4: Frontend Global UI & Auth Pages**
  - `[x]` Setup global CSS, custom color palette, and font.
  - `[x]` Create Navbar and Footer.
  - `[x]` Create Register page UI.
  - `[x]` Create Login page UI.
  - `[x]` Integrate Auth Context/State.

- `[x]` **Phase 5: Frontend Core Pages (Public)**
  - `[x]` Create Home Page Hero section.
  - `[x]` Create Home Page dynamic sections.
  - `[x]` Create Explore Page UI.
  - `[x]` Create Item Card component.
  - `[x]` Integrate Explore Page with backend API.
  - `[x]` Create Details Page.

- `[ ]` **Better Auth Migration**
  - `[ ]` Backend: Install better-auth and @better-auth/mongo-adapter
  - `[ ]` Backend: Configure auth.ts and mount in express
  - `[ ]` Backend: Delete old JWT custom code (utils/auth.ts, authController, authRoutes)
  - `[ ]` Frontend: Install @better-auth/react
  - `[ ]` Frontend: Setup auth-client.ts and update AuthContext
  - `[ ]` Frontend: Update login/register pages

- `[ ]` **Phase 6: Frontend Protected Pages**
  - `[ ]` Create Add Item Page.
  - `[ ]` Integrate Add Item Page with backend API.
  - `[ ]` Create Manage Items Page.
  - `[ ]` Integrate Manage Items Page with delete and view.

- `[ ]` **Phase 7: AI Integration**
  - `[ ]` Integrate `@google/genai` SDK in backend.
  - `[ ]` Create POST /api/ai/generate-content endpoint.
  - `[ ]` Add "AI Generate Content" button on Add Item Page.
  - `[ ]` Create GET /api/ai/recommendations endpoint.
  - `[ ]` Display "Recommended for You" section on frontend.

- `[ ]` **Phase 8: Polish & Additional Pages**
  - `[ ]` Create About page.
  - `[ ]` Create Contact page.
  - `[ ]` Final UI/UX review.
  - `[ ]` Final responsive testing.
