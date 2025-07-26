# Nursing Simulation Company - Laravel + React + Inertia

A modern, full-stack web application for a nursing simulation company built with Laravel, React, and Inertia.js.

## 🚀 Technology Stack

### Backend
- **Laravel 12** - PHP framework for robust backend development
- **SQLite** - Lightweight database (can be easily switched to MySQL/PostgreSQL)
- **Eloquent ORM** - Database management and relationships

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Inertia.js** - Seamless SPA experience without API complexity
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with responsive design

### Key Features
- **No API Complexity** - Using Inertia.js for seamless server-client communication
- **Form Validation** - Server-side validation with real-time feedback
- **Database Storage** - Contact form submissions stored in database
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Professional healthcare-themed design

## 📁 Project Structure

```
nursing-sim-laravel/
├── app/
│   ├── Http/Controllers/
│   │   ├── HomeController.php      # Main page controller
│   │   └── ContactController.php   # Contact form handling
│   └── Models/
│       └── Contact.php             # Contact model with validation
├── database/
│   └── migrations/
│       └── create_contacts_table.php
├── resources/
│   ├── js/
│   │   ├── app.jsx                 # Main React application
│   │   ├── Layouts/
│   │   │   └── MainLayout.jsx      # Shared layout component
│   │   └── Pages/
│   │       └── Home.jsx            # Main page component
│   ├── css/
│   │   └── app.css                 # Complete styling
│   └── views/
│       └── app.blade.php           # Main blade template
├── routes/
│   └── web.php                     # Application routes
└── vite.config.js                  # Vite configuration
```

## 🎯 Website Structure

Based on client requirements, the website follows this exact page structure:

### 📄 Pages
- **HOME** - Hero section with company introduction and call-to-action
- **ABOUT** - Company information with two subsections:
  - **MISSION** - Company mission and goals
  - **VISION** - Future vision and aspirations
- **IMAGES** - Training modules showcase with four key areas:
  - **TRANSFERRING A PATIENT** - Safe patient transfer techniques
  - **CHILDBIRTH** - Obstetric care and delivery procedures
  - **INTUBATION** - Airway management and intubation training
  - **ORTHO - RANGE OF MOTION** - Orthopedic assessment and rehabilitation

## 🛠️ Installation & Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nursing-sim-laravel
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

### Development

1. **Start Laravel development server**
   ```bash
   php artisan serve
   ```

2. **Start Vite development server (for hot reloading)**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Laravel: http://localhost:8000
   - Vite: http://localhost:5173

## 🔧 Configuration

### Database
The application uses SQLite by default. To switch to MySQL or PostgreSQL:

1. Update `.env` file with your database credentials
2. Run migrations: `php artisan migrate:fresh`

### Environment Variables
Key environment variables in `.env`:
```env
APP_NAME="NursingSim Pro"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite
```

## 📊 Database Schema

### Contacts Table
```sql
CREATE TABLE contacts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

## 🎨 Frontend Architecture

### React Components
- **MainLayout** - Shared layout with navigation and footer
- **Home** - Main page with all sections (Hero, About, Images, Contact)

### Inertia.js Integration
- **Server-side rendering** with seamless SPA experience
- **Form handling** with validation and error handling
- **No API complexity** - direct server communication

### Styling
- **Custom CSS** with responsive design
- **CSS Grid and Flexbox** for modern layouts
- **Mobile-first approach** with breakpoints at 768px and 480px
- **Professional color scheme** with healthcare theme

## 🔄 API Endpoints

### Routes
```php
GET  /                    # Home page
POST /contact            # Contact form submission
```

### Contact Form
- **Validation**: Server-side validation with real-time feedback
- **Storage**: Contact submissions stored in database
- **Response**: Success/error messages via Inertia.js

## 🚀 Deployment

### Production Build
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Recommended Hosting
- **Laravel Forge** - Managed Laravel hosting
- **Vercel** - Frontend deployment with Laravel API
- **DigitalOcean** - VPS with Laravel setup
- **Heroku** - Platform as a Service

### Environment Setup
1. Set `APP_ENV=production`
2. Set `APP_DEBUG=false`
3. Configure database connection
4. Set up SSL certificate
5. Configure web server (Nginx/Apache)

## 🔧 Customization

### Adding New Pages
1. Create React component in `resources/js/Pages/`
2. Add route in `routes/web.php`
3. Create controller method
4. Update navigation in `MainLayout.jsx`

### Styling Changes
- Modify `resources/css/app.css`
- Use CSS custom properties for theming
- Responsive design with mobile-first approach

### Database Changes
1. Create migration: `php artisan make:migration`
2. Update model with new fields
3. Run migration: `php artisan migrate`

## 📈 Performance Optimization

### Frontend
- **Vite** for fast development and optimized builds
- **Code splitting** with React lazy loading
- **CSS optimization** with Vite's CSS processing

### Backend
- **Route caching** in production
- **View caching** for compiled templates
- **Database indexing** for optimal queries

## 🔒 Security Features

- **CSRF protection** with Laravel's built-in middleware
- **Form validation** with server-side rules
- **SQL injection prevention** with Eloquent ORM
- **XSS protection** with proper output escaping

## 🧪 Testing

### Running Tests
```bash
php artisan test
```

### Frontend Testing
```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

## 📄 License

This project is created for the nursing simulation company. All rights reserved.

## 🤝 Support

For questions about this application:
- **Email**: info@nursingsimpro.com
- **Documentation**: Check Laravel and Inertia.js documentation
- **Issues**: Create GitHub issue for bugs or feature requests

---

**Note**: This application is designed as a surprise for Dr. Melissa Culp and Mrs. Sandra Coleman, as requested by Grace. The company name and specific details can be updated once the principals provide their preferences.
