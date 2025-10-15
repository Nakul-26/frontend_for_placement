# Placement Website

This is a web application for managing student placements. It provides different dashboards and functionalities for students, faculty, admins, and managers.

## Features

*   **Role-based access control:** Different users have different permissions based on their roles.
*   **Dashboards:** Separate dashboards for students, faculty, admins, and managers.
*   **Job Offerings:** Manage and view job offerings.
*   **Notifications:** A notification system to keep users informed.
*   **Student Applications:** Students can apply for jobs and track their applications.

## Tech Stack

*   **Frontend:** React, Vite, React Router
*   **Styling:** CSS Modules, Material-UI
*   **API Communication:** Axios
*   **Linting:** ESLint

## Project Structure

The project follows a standard React project structure.

```
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vercel.json
├── vite.config.js
├── .git/
├── dist/
├── node_modules/
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    │   ├── logo.png
    │   └── logo3.png
    ├── components/
    │   ├── ErrorBoundary.jsx
    │   ├── Footer.css
    │   ├── Footer.jsx
    │   ├── Header.css
    │   ├── Header.jsx
    │   ├── JobOfferings.css
    │   ├── JobOfferings.jsx
    │   ├── Layout.css
    │   ├── Layout.jsx
    │   ├── Notifications.css
    │   ├── Notifications.jsx
    │   ├── ProtectedRoute.jsx
    │   └── RoleLoginForm.jsx
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── AuthProvider.jsx
    │   └── useAuth.jsx
    ├── pages/
    │   ├── ...
    ├── services/
    │   └── api.jsx
    └── styles/
        ├── responsive.css
        └── styles.css
```

## Application Flow

### Authentication

1.  **Login:** The user enters their credentials on the `Login` page. The `login` function in `AuthProvider` makes an API call to the backend to authenticate the user.
2.  **Token Storage:** Upon successful login, the backend returns a JWT (JSON Web Token) which is stored in an HttpOnly cookie. This is handled automatically by the browser.
3.  **Authenticated Requests:** For subsequent requests to the backend, the browser automatically sends the JWT in the cookie. The `axios` instance in `src/services/api.jsx` is configured to send credentials with each request.
4.  **Token Refresh:** The application uses an `axios` interceptor to handle expired tokens. If a request fails with an "access token not defined" error, the interceptor attempts to refresh the token by calling the `/api/refresh` endpoint. If the refresh is successful, the original request is retried. If the refresh fails, the user is logged out.

### Data Flow

1.  **Component:** A component needs to fetch data from the backend.
2.  **API Service:** The component imports and calls a function from `src/services/api.jsx`.
3.  **Axios Instance:** The API service function uses the `axios` instance to make a request to the backend.
4.  **Backend:** The backend receives the request, processes it, and returns a response.
5.  **Component:** The component receives the data and updates its state, causing a re-render.

## Adding New Pages and Routes

1.  **Create the Page Component:** Create a new `.jsx` file for your page in the `src/pages` directory.
2.  **Add the Route:** Open `src/App.jsx` and add a new `<Route>` component for your page. To protect the route and make it accessible only to specific roles, wrap it in a `<Route>` with a `ProtectedRoute` element, like this:

    ```jsx
    <Route element={<ProtectedRoute roles={['admin']} />}>
      <Route path="/admin/my-new-page" element={<Layout><MyNewPage /></Layout>} />
    </Route>
    ```

    This will ensure that only users with the `admin` role can access the `/admin/my-new-page` route.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root of the project and add the following environment variables:
    ```
    VITE_BACKEND_URL=<your-backend-url>
    VITE_NOTIFICATIONS_URL=<your-notifications-url>
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Coding Conventions

*   **Components:** Components are written as functions and use React Hooks. Component files are named in PascalCase (e.g., `Header.jsx`).
*   **Styling:** The project uses a combination of global CSS and CSS Modules. For new components, prefer CSS Modules to encapsulate styles. CSS Module files are named `[ComponentName].module.css` (e.g., `Login.module.css`).
*   **Naming:**
    *   Components: PascalCase (e.g., `Header`, `Footer`)
    *   Variables and functions: camelCase (e.g., `user`, `logout`)
    *   CSS classes: kebab-case (e.g., `login-container`)
*   **Linting:** The project uses ESLint to enforce code quality. Run `npm run lint` to check for linting errors.

## UI and Styling

*   **UI Library:** The project uses Material-UI for some UI components.
*   **Color Scheme:**
    *   Primary color: `#007bff`
    *   Background color: `#f0f2f5`
    *   Text color: `#333`
    *   Success color: `#155724`
    *   Error color: `#721c24`

## API Endpoints

This API documentation covers four main resource categories: Users, Roles, Permissions, and Role-Permissions.

### Users

*   **GET /users**
    *   Permission: `read_users`
*   **POST /users/register**
    *   Permission: `create_users`
    *   Body (JSON):
        ```json
        {
          "name": "string",
          "email": "string",
          "password": "string",
          "role_id": "number"
        }
        ```
*   **GET /users/me**
    *   Permission: `read_user`
*   **PUT /users/:id**
    *   Permission: `update_users`
*   **DELETE /users/:id**
    *   Permission: `delete_users`

### Roles

*   **GET /roles**
    *   Permission: `read_roles`
*   **GET /roles/:id**
    *   Permission: `read_roles`
*   **POST /roles**
    *   Permission: `create_roles`
    *   Body (JSON):
        ```json
        {
          "name": "string",
          "description": "string",
          "is_active": "boolean"
        }
        ```
*   **PUT /roles/:id**
    *   Permission: `update_roles`
*   **DELETE /roles/:id**
    *   Permission: `delete_roles`

### Permissions

*   **GET /permissions**
    *   Permission: `read_permissions`
*   **GET /permissions/:id**
    *   Permission: `read_permissions_id`
*   **POST /permissions**
    *   Permission: `create_permissions`
    *   Body (JSON):
        ```json
        {
          "name": "string",
          "description": "string"
        }
        ```
*   **DELETE /permissions/:id**
    *   Permission: `delete_permissions`

### Role-Permissions

*   **GET /role-permissions/:roleId**
    *   Permission: `read_role_permissions`
*   **POST /role-permissions**
    *   Permission: `assign_role_permissions`
*   **DELETE /role-permissions**
    *   Permission: `delete_role_permissions`
*   **POST /role-permissions/check-access**
    *   Permission: `none`
