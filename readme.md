# Convex Auth Solid

Build authenticated SolidJS apps with Convex, without turning setup into a side quest.

- **Drop-in template** - get auth running in minutes.
- **Battle-tested flows** - login, signup, session management, and more.
- **Fully typed** - TypeScript end-to-end for confidence in your code.
- **Your UI, your rules** - use the hooks or bring your own components.

Quick link

- code - https://github.com/david1gp/convex-auth-solid

## Features

- **User Management**
  - User registration with username and password
  - Email/password authentication with secure session handling
  - Login via email address
  - OAuth integration: Google, GitHub, and Microsoft
  - Change email address
  - Change password
  - Delete user account

- **Development Tools**
  - Single-button login for rapid development iterations
  - Bash deployment scripts for self hosted convex 

- **Multi-Tenant Architecture**
  - Workspaces for organizing projects and resources
  - Organizations with team collaboration support

- **Storage & Data**
  - Infinitely scaling R2 object storage for files
  - Direct file uploads from browser
  - Persistent UI state: draft resources/workspaces survive navigation
  - Intelligent browser caching: instant client-side loading with background refresh

- **Technical Foundation**
  - JWT-based tokens with automatic refresh
  - Ready-to-use Solid.js UI components
  - Convex backend functions for user management
  - Email integration with transactional templates
  - Full TypeScript end-to-end type safety
  - Real-Time updates with Convex Backend

## Getting Started

1. **Clone the template:**

   ```bash
   git clone https://github.com/david1gp/convex-auth-solid.git
   cd convex-auth-solid
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Download the UI components locally:**

   ```bash
   bunx degit https://github.com/david1gp/solid-ui/ui ui
   ```

   Keeping the UI code local is the recommended setup here:

   - Some bundlers can accidentally bundle more than one `solid-js` instance when UI components are imported from `node_modules`, which can lead to confusing runtime behavior.
   - Local components are also much nicer to customize. You can restyle, adjust, or replace them freely, similar to the `shadcn/ui` approach.

4. **Set up absolute import aliases in `package.json`:**

   It is recommended to define your app aliases in `package.json` `imports`, so local modules and copied UI components can be imported consistently across the project.

   ```json
   {
     "imports": {
       "#convex/*": "./convex/*",
       "#src/*.js": "./src/*.ts",
       "#src/*.jsx": "./src/*.tsx",
       "#src/*": "./src/*",
       "#ui/*.js": "./ui/*.ts",
       "#ui/*.jsx": "./ui/*.tsx",
       "#ui/*": "./ui/*",
       "#utils/*": "@adaptive-ds/utils/*",
       "#result": "@adaptive-ds/result",
       "#result/*": "@adaptive-ds/result/*"
     }
   }
   ```

5. **Set up Convex:**

   ```bash
   bun run convex:dev
   ```

6. **Start the dev server:**

   ```bash
   bun run dev
   ```

## Tech Stack

- **Solid.js** – Reactive UI framework
- **Convex** – Backend-as-a-service with real-time sync
- **Tailwind CSS** – Styling
- **TypeScript** – Type safety

## License

MIT - see the [LICENSE](LICENSE) file for details.
