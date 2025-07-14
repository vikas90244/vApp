# vApp Monorepo

This repository contains all components of the vApp project, organized as a single monorepo.

## Project Structure

```
vApp/
├── frontend/           # Next.js frontend application
├── booth/             # Anchor program
├── booth_backend/     # Backend services
└── env/              # Environment configurations
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/vikas90244/vApp.git
   cd vApp
   ```

2. Install dependencies:
   ```bash
   # Install root dependencies
   yarn install

   # Install frontend dependencies
   cd frontend && npm install

   # Install booth dependencies
   cd ../booth && cargo build

   # Install booth backend dependencies
   cd ../booth_backend && python -m venv env && source env/bin/activate && python manage.py runserver 
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in each component directory
   - Update the environment variables as needed

## Development

### Frontend
```bash
cd frontend
yarn dev
```

### Booth
```bash
cd booth
anchor build
anchor test
```

### Booth Backend
```bash
cd booth_backend
cargo run
```

## Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Commit your changes:
   ```bash
   git commit -m 'feat: your feature'
   ```

3. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
