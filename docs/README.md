# UniPay Documentation

## Overview
This documentation folder contains comprehensive information about all UniPay components, features, and implementation details.

## Documentation Structure

### 📁 Features Documentation (`docs/features/`)
- Detailed documentation for each feature module
- Implementation status (✅ Completed | 🚧 In Progress | 📋 Planned)
- Component descriptions and functionality
- Technical implementation details

### 📁 Architecture Documentation (`docs/architecture/`)
- System architecture overview
- Database schema and relationships
- API design patterns
- Frontend architecture

### 📁 API Documentation (`docs/api/`)
- Endpoint specifications
- Request/Response formats
- Authentication flow
- Error handling

## Quick Links

### ✅ Completed Features
- [Authentication](features/01-authentication.md) - Login, Register, JWT tokens
- [Wallet](features/02-wallet.md) - Balance, Top-up, Transfers  
- [Cards](features/03-cards.md) - Virtual cards, Freeze/Unfreeze
- [Transactions](features/04-transactions.md) - History, Statistics
- [Savings](features/05-savings.md) - DarkDays Pocket, Piggy Goals
- [Marketplace](features/06-marketplace.md) - Student trading platform
- [Loans](features/07-loans.md) - P2P lending and debt tracking
- [Profile](features/08-profile.md) - User profile and achievements
- [Settings](features/09-settings.md) - Account settings
- [Transfers](features/10-transfers.md) - Dedicated transfer interface
- [Top-up](features/11-topup.md) - Wallet funding methods
- [Notifications](features/12-notifications.md) - Real-time alerts

## Development Status

| Feature | Status | Backend API | Frontend UI | Documentation |
|---------|--------|-------------|-------------|---------------|
| Authentication | ✅ Complete | ✅ | ✅ | ✅ |
| Wallet | ✅ Complete | ✅ | ✅ | ✅ |
| Cards | ✅ Complete | ✅ | ✅ | ✅ |
| Transactions | ✅ Complete | ✅ | ✅ | ✅ |
| Savings | ✅ Complete | ✅ | ✅ | ✅ |
| Marketplace | ✅ Complete | ✅ | ✅ | ✅ |
| Loans | ✅ Complete | ✅ | ✅ | ✅ |
| Profile | ✅ Complete | ✅ | ✅ | ✅ |
| Settings | ✅ Complete | ✅ | ✅ | ✅ |
| Transfers | ✅ Complete | ✅ | ✅ | ✅ |
| Top-up | ✅ Complete | ✅ | ✅ | ✅ |
| Notifications | 🚧 UI Only | 📋 Planned | ✅ | ✅ |

## Getting Started

1. Read the [Architecture Overview](architecture/overview.md)
2. Review [API Documentation](api/endpoints.md)
3. Explore individual feature documentation in `features/`

## Contributing

When adding new features:
1. Create feature documentation in `docs/features/`
2. Update this README with links and status
3. Document API endpoints in `docs/api/`
4. Update architecture diagrams if needed
