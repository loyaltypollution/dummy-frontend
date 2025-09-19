## Dummy Frontend

This project is a simple frontend that demonstrates a proof of concept for rendering arbitrary UI components as directed by a Conductor (evaluator). It is intended for development and experimentation with UI protocols.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/)

### Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Clone the Proof of Concept evaluator**

   The frontend expects an evaluator (e.g., `echo-slang`) to be present in the same parent directory.

   ```bash
   git clone --branch UIPlugin https://github.com/loyaltypollution/echo-slang.git
   ```

   Your directory structure should look like:

   ```
   parent-folder/
   ├── dummy-frontend/
   └── echo-slang/
   ```

3. **Build the frontend**

   ```bash
   npm run build
   ```

   > **Note:** If you need to build the evaluator (host-side), navigate to the `echo-slang` directory and run its build command as well (e.g., `npm run build`).

4. **Run the local server**

   ```bash
   node ./server.cjs
   ```

---

## Usage

- Open your browser and navigate to [http://localhost:8080](http://localhost:8080) (or the port specified by your server).
- Interact with the UI to test communication between the frontend and the evaluator.

---

## Notes

- This is a development/proof-of-concept setup. For production or more advanced usage, further configuration may be required.
- Ensure both `dummy-frontend` and `echo-slang` are kept up to date for compatibility.

---
