# Equipment Manager

A comprehensive equipment management solution for tracking maintenance, costs, and optimizing fleet operations. Built with React Native and Expo.

[View Live Demo](https://cloudify-equipment-manager.netlify.app)

## 🤖 AI-Generated Application

This application is a prototype generated using artificial intelligence. It demonstrates the capabilities of AI in creating modern, production-ready applications while following best practices and industry standards.

### Current Development Status

The application is currently in active development with the following features implemented:

✅ User Authentication
- Email/password authentication
- Persistent login
- Profile management

✅ Equipment Management
- Add/edit/delete equipment
- Equipment details and specifications
- Status tracking
- Image management
- Vehicle information tracking

✅ Maintenance Tracking
- Schedule maintenance tasks
- Track service history
- Record maintenance costs
- Service provider management

✅ Cost Management
- Record and categorize expenses
- Track maintenance costs
- Monitor fuel expenses
- Expense history

🚧 In Progress
- Equipment reports and analytics
- Cost analysis and reporting
- Data export capabilities
- Advanced search and filtering

## 🚀 Features

### Equipment Management
- Track equipment details including name, type, year, and status
- Store equipment photos with cloud storage
- Record purchase information and specifications
- Monitor equipment status and condition
- Manage vehicle-specific information (VIN, license plate)

### Maintenance Management
- Schedule and track maintenance tasks
- Record service history and costs
- Set maintenance reminders
- Track service providers
- Monitor maintenance expenses

### Cost Tracking
- Record and categorize expenses
- Track maintenance and repair costs
- Monitor fuel expenses
- Store expense details and notes
- View cost history and trends

## 🛠 Technology Stack

### Frontend
- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- Lucide Icons for UI elements
- Custom components for consistent design

### Backend
- Supabase for backend services
- PostgreSQL database
- Row Level Security (RLS) for data protection
- Real-time subscriptions
- Cloud storage for images

### Authentication
- Supabase Auth
- Secure email/password authentication
- Session management
- Protected routes

## 📱 Platform Support

The application is built with web-first support while maintaining compatibility with native platforms:

- ✅ Web (Primary Platform)
- ✅ iOS (Compatible)
- ✅ Android (Compatible)

## 🏗 Project Structure

```
equipment-manager/
├── app/                   # Application routes
│   ├── (tabs)/           # Tab-based navigation
│   ├── auth/             # Authentication screens
│   └── _layout.tsx       # Root layout configuration
├── components/           # Reusable components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── types/              # TypeScript type definitions
└── supabase/           # Database migrations and configuration
```

## 🔒 Security Features

- Row Level Security (RLS) policies for data protection
- Secure authentication flow
- Protected API routes
- Environment variable management
- Secure image upload and storage

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/equipment-manager.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## 📦 Deployment

The application is deployed on Netlify with automatic deployments from the main branch. Each push triggers a new deployment with:

- Automatic build process
- Environment variable management
- Preview deployments for pull requests
- Custom domain support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)