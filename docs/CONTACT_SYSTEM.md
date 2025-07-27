# Contact Form System

## Overview

The contact form system allows visitors to send messages through the "Get In Touch" form on the landing page, and provides admins with a comprehensive interface to manage and respond to these messages.

## Features

### For Visitors
- **Contact Form**: Located on the landing page with fields for name, email, institution (optional), and message
- **Validation**: Real-time validation with helpful error messages
- **Success Feedback**: Confirmation message after successful submission
- **Error Handling**: Graceful error handling with user-friendly messages

### For Admins
- **Contact Management**: View all contact submissions in a paginated list
- **Status Tracking**: Track message status (new, in_progress, resolved, closed)
- **Read/Unread**: Mark messages as read when viewed
- **Response System**: Send responses to contacts directly from the admin interface
- **Search & Filter**: Search by name, email, institution and filter by status
- **Statistics**: View contact statistics (total, new, unread, recent)
- **Delete**: Remove unwanted contact messages

## Database Schema

### Contacts Table
```sql
contacts
├── id (primary key)
├── name (string, required)
├── email (string, required, validated)
├── institution (string, nullable)
├── message (text, required, max 2000 chars)
├── status (enum: new, in_progress, resolved, closed)
├── is_read (boolean, default false)
├── admin_response (text, nullable)
├── responded_at (timestamp, nullable)
├── responded_by (foreign key to users.id, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## API Endpoints

### Public Endpoints
- `POST /contact` - Submit contact form

### Admin Endpoints (requires admin authentication)
- `GET /admin/contacts` - List all contacts
- `GET /admin/contacts/{id}` - View contact detail
- `POST /admin/contacts/{id}/respond` - Respond to contact
- `PUT /admin/contacts/{id}/status` - Update contact status
- `DELETE /admin/contacts/{id}` - Delete contact

## Usage

### Submitting a Contact Form

1. Navigate to the landing page
2. Scroll to the "Get In Touch" section
3. Fill out the form:
   - **Name**: Your full name (required)
   - **Email**: Your email address (required, must be valid format)
   - **Institution**: Your organization (optional)
   - **Message**: Your message (required, max 2000 characters)
4. Click "Send Message"
5. You'll see a success confirmation

### Admin Management

#### Viewing Contacts
1. Log in as an admin user
2. Navigate to `/admin/contacts`
3. View the list of all contact submissions
4. Use search and filters to find specific messages

#### Responding to Contacts
1. Click the "View" button (eye icon) next to a contact
2. Read the contact message
3. Click "Respond" to open the response form
4. Type your response (max 2000 characters)
5. Click "Send Response"
6. The contact status will automatically change to "resolved"

#### Managing Contact Status
- **New**: Initial status for all new contacts
- **In Progress**: Mark when you're working on a response
- **Resolved**: Automatically set when you respond
- **Closed**: Mark when the issue is completely resolved

## Testing

### Running Tests
```bash
# Test contact form functionality
php artisan test --filter=ContactControllerTest

# Test admin contact management
php artisan test --filter=AdminContactTest

# Run all contact-related tests
php artisan test --filter=Contact
```

### Creating Test Data
```bash
# Create 5 test contacts
php artisan contact:test

# Create 10 test contacts
php artisan contact:test --count=10
```

## Configuration

### Validation Rules
Contact form validation rules are defined in `App\Models\Contact::rules()`:
- Name: required, string, max 255 characters
- Email: required, valid email format, max 255 characters
- Institution: optional, string, max 255 characters
- Message: required, string, max 2000 characters

### Status Options
Contact status options are defined in the database migration:
- `new`: Default status for new contacts
- `in_progress`: When admin is working on the contact
- `resolved`: When admin has responded
- `closed`: When the issue is completely resolved

## Security Features

- **CSRF Protection**: All forms include CSRF tokens
- **Input Validation**: Server-side validation for all inputs
- **Admin Authentication**: Contact management requires admin privileges
- **SQL Injection Protection**: Uses Laravel's Eloquent ORM
- **XSS Protection**: Output is properly escaped in views

## Error Handling

### Form Submission Errors
- Validation errors are displayed inline
- Network errors show user-friendly messages
- Server errors are logged for debugging

### Admin Interface Errors
- Permission errors redirect to login
- Not found errors show 404 pages
- Database errors are logged and handled gracefully

## Monitoring and Logging

### Contact Submissions
All contact form submissions are logged with:
- Contact name and email
- Institution (if provided)
- Message length (for privacy, full message is not logged)
- Timestamp

### Admin Actions
Admin actions are tracked:
- Who responded to each contact
- When responses were sent
- Status changes
- Contact deletions

## Future Enhancements

### Planned Features
1. **Email Notifications**: Send email notifications to admins for new contacts
2. **Auto-Response**: Send automatic confirmation emails to contact form submitters
3. **Contact Categories**: Categorize contacts (general, technical, billing, etc.)
4. **Contact Templates**: Pre-written response templates for common inquiries
5. **Contact Analytics**: Advanced analytics and reporting
6. **Bulk Actions**: Select multiple contacts for bulk operations
7. **Contact Export**: Export contacts to CSV/Excel
8. **Contact Import**: Import contacts from external sources

### Technical Improvements
1. **Real-time Updates**: WebSocket notifications for new contacts
2. **Contact Search**: Full-text search across all contact fields
3. **Contact History**: Track all changes to contact status and responses
4. **Contact Assignment**: Assign contacts to specific admin users
5. **Contact SLA**: Set and track response time requirements

## Troubleshooting

### Common Issues

#### Contact Form Not Working
1. Check if the route exists: `php artisan route:list | grep contact`
2. Verify the form action points to `/contact`
3. Check browser console for JavaScript errors
4. Verify CSRF token is included in the form

#### Admin Can't Access Contacts
1. Ensure user has admin privileges (`is_admin = true`)
2. Check if admin middleware is properly configured
3. Verify admin routes are accessible

#### Contact Not Saving
1. Check database connection
2. Verify contacts table exists and has correct structure
3. Check application logs for errors
4. Verify validation rules are correct

#### Contact Statistics Not Updating
1. Clear application cache: `php artisan cache:clear`
2. Check if database queries are working
3. Verify contact counts in database directly

### Debug Commands
```bash
# Check contact routes
php artisan route:list | grep contact

# Check database structure
php artisan migrate:status

# Clear application cache
php artisan cache:clear

# View application logs
tail -f storage/logs/laravel.log
```

## Support

For issues with the contact system:
1. Check the application logs in `storage/logs/laravel.log`
2. Verify database connectivity and structure
3. Test with the provided test commands
4. Review the validation rules and error handling 