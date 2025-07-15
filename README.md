# 🗳️ vApp - Decentralized Voting Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13.4+-000000?logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?logo=django)](https://www.djangoproject.com/)
[![Solana](https://img.shields.io/badge/Solana-14F195?logo=solana&logoColor=white)](https://solana.com/)

vApp is a decentralized voting platform built on the Solana blockchain, featuring a modern web interface and robust backend services. This project demonstrates full-stack development skills with a focus on blockchain integration.

## 🌟 Features

- **Decentralized Voting**: Secure and transparent voting on the Solana blockchain
- **Real-time Results**: Instant updates on poll results
- **User-friendly Interface**: Modern, responsive design with intuitive UX
- **Secure Authentication**: Wallet-based authentication using Solana
- **Custom Poll Creation**: Create and manage your own polls with ease

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **UI**: shadcn/ui components
- **State Management**: React Context API
- **Blockchain**: @solana/web3.js, @project-serum/anchor
- **Styling**: Tailwind CSS

### Backend
- **Framework**: Django 4.2
- **Database**: SQLite (Development), PostgreSQL (Production-ready)
- **REST API**: Django REST Framework

### Blockchain
- **Program**: Anchor (Rust)
- **Network**: Solana Devnet/Mainnet
- **Smart Contracts**: On-chain voting logic

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Rust & Cargo
- Solana CLI
- Yarn
- PostgreSQL (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikas90244/vApp.git
   cd vApp
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   yarn install
   cp .env.example .env.local
   # Update environment variables in .env.local
   ```

3. **Set up the backend**
   ```bash
   cd ../booth_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Update environment variables in .env
   python manage.py migrate
   ```

4. **Set up the Solana program**
   ```bash
   cd ../booth
   cargo build
   anchor build
   anchor deploy
   ```

## 🛠️ Development

### Running Locally

1. **Start the development servers**
   ```bash
   # Terminal 1: Backend
   cd booth_backend
   python manage.py runserver

   # Terminal 2: Frontend
   cd ../frontend
   yarn dev
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

### Environment Variables

Create `.env` files in each directory with the following variables:

**Frontend (frontend/.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID
```

**Backend (booth_backend/.env)**
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
yarn test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set up environment variables
3. Deploy!

### Backend (Render/Railway)
1. Set up a PostgreSQL database
2. Configure environment variables
3. Deploy your Django application

## 📚 Documentation

- [API Documentation](/docs/API.md)
- [Smart Contract Documentation](/docs/SMART_CONTRACTS.md)
- [Frontend Architecture](/docs/FRONTEND.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Team for the amazing blockchain platform
- Next.js and Django communities
- All contributors and testers
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
