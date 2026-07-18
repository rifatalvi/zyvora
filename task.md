- `[x]` **Phase 1: Initial Setup**
  - `[x]` Initialize Next.js in `c:\Agentic_Ai\zyvora` (TypeScript, Tailwind).
  - `[x]` Initialize Node.js/Express in `c:\Agentic_Ai\zyvora-server` (TypeScript setup).
  - `[x]` Install essential frontend dependencies.
  - `[x]` Install essential backend dependencies.

- `[x]` **Phase 2: Database & Better Auth (Backend)**
  - `[x]` Setup MongoDB connection in the backend.
  - `[x]` Setup Better Auth in `src/config/auth.ts` with MongoDB adapter.
  - `[x]` Configure custom User fields (role, avatar, bio).
  - `[x]` Mount Better Auth API handler in Express.

- `[x]` **Phase 3: Backend API (Items/Courses)**
  - `[x]` Create Item Mongoose schema.
  - `[x]` Create Better Auth middleware (`protect` and `restrictTo`) to secure API endpoints.
  - `[x]` Create POST /api/items endpoint (Secured with Better Auth).
  - `[x]` Create GET /api/items endpoint.
  - `[x]` Create GET /api/items/:id endpoint.
  - `[x]` Create DELETE /api/items/:id endpoint (Secured with Better Auth).

- `[x]` **Phase 4: Frontend Global UI & Better Auth (Frontend)**
  - `[x]` Setup global CSS, custom color palette, and font.
  - `[x]` Create Navbar and Footer.
  - `[x]` Create Register page UI.
  - `[x]` Create Login page UI.
  - `[x]` Integrate Better Auth Client (`@better-auth/react`) and AuthContext.

- `[x]` **Phase 5: Frontend Core Pages (Public)**
  - `[x]` Create Home Page Hero section.
  - `[x]` Create Home Page dynamic sections.
  - `[x]` Create Explore Page UI.
  - `[x]` Create Item Card component.
  - `[x]` Integrate Explore Page with backend API.
  - `[x]` Create Details Page.

- `[x]` **Better Auth Migration (Completed)**
  - `[x]` Backend: Install better-auth and @better-auth/mongo-adapter
  - `[x]` Backend: Configure auth.ts and mount in express
  - `[x]` Backend: Delete old JWT custom code (utils/auth.ts, authController, authRoutes)
  - `[x]` Frontend: Install @better-auth/react
  - `[x]` Frontend: Setup auth-client.ts and update AuthContext
  - `[x]` Frontend: Update login/register pages

- `[x]` **Phase 6: Frontend Protected Pages**
  - `[x]` Create Add Item Page.
  - `[x]` Integrate Add Item Page with backend API.
  - `[x]` Create Manage Items Page.
  - `[x]` Integrate Manage Items Page with delete and view.

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
