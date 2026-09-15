# Traveloop Postman Collection

This folder contains Postman configuration files for testing the Traveloop API.

## Files

- **Traveloop_API_Collection.json** - Main Postman collection with all API endpoints
- **development_environment.json** - Development environment variables (localhost)
- **production_environment.json** - Production environment variables (production server)

## Setup Instructions

### 1. Import Collection into Postman

1. Open Postman
2. Click "Import" in the top left
3. Select `Traveloop_API_Collection.json`
4. The collection will be imported with all API endpoints organized by feature

### 2. Import Environments

1. In Postman, go to the "Environments" section (top right)
2. Click "Import"
3. Select both `development_environment.json` and `production_environment.json`
4. You will see two environments: "Traveloop Development" and "Traveloop Production"

### 3. Configure Production Environment

Before using the production environment, you need to update the placeholder values:

1. Select "Traveloop Production" from the environment dropdown
2. Click the eye icon to view variables
3. Update the following variables:
   - `base_url`: Your production domain (e.g., `https://traveloop.com`)
   - `api_url`: Your production API URL (e.g., `https://traveloop.com/api`)
   - `test_user_email`: A valid test user email for production
   - `test_user_password`: The corresponding password
   - `test_user_name`: The corresponding user name
   - `sample_trip_id`: A valid trip ID from your production database

### 4. Switch Between Environments

- For **local development**: Select "Traveloop Development" from the environment dropdown
- For **production testing**: Select "Traveloop Production" from the environment dropdown

## Environment Variable Separation

The environments are completely separated to prevent mixing development and production data:

### Development Environment
- **base_url**: `http://localhost:3000`
- **api_url**: `http://localhost:3000/api`
- **environment**: `development`
- Pre-filled test credentials for local testing
- Sample trip ID set to `1` (mock data)

### Production Environment
- **base_url**: `https://your-production-domain.com` (placeholder)
- **api_url**: `https://your-production-domain.com/api` (placeholder)
- **environment**: `production`
- Empty credentials (must be filled in manually)
- Empty trip ID (must be filled in manually)

## API Endpoints Included

The collection includes all API endpoints organized by feature:

### Authentication
- Sign Up
- Login (with auto token capture)
- Get Current User (Me)
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Verify OTP

### Users
- Get User by ID
- Update User Profile
- Search Users

### Trips
- Get All Trips (with filters)
- Create Trip
- Get Trip by ID
- Update Trip
- Delete Trip
- Get Trip by Join Code

### Trip Activities
- Get Trip Activities
- Create Activity
- Get Activity Feed
- Update Activity
- Delete Activity

### Trip Budget
- Get Trip Budget
- Add Budget Item
- Update Budget Item
- Delete Budget Item

### Trip Map
- Get Map Points
- Add Map Point
- Update Map Point
- Delete Map Point
- Sync Map Points

### Trip Members
- Get Trip Members

### Trip Invitations
- Get Trip Invitations
- Join Trip by Code

### Trip Notes
- Get Trip Notes
- Create Note
- Update Note
- Delete Note

### Trip Packing List
- Get Packing List
- Add Packing Item
- Update Packing Item
- Delete Packing Item

### Invitations
- Create Invitation
- Accept Invitation

### Cities
- Get Cities (with search and region filters)

## Usage Tips

1. **Authentication**: The Login request automatically captures the auth token and stores it in the `auth_token` environment variable for use in authenticated requests.

2. **Dynamic Variables**: All requests use environment variables (e.g., `{{api_url}}`, `{{sample_trip_id}}`) so they automatically adapt to the selected environment.

3. **Test Data**: The development environment includes sample test data. Replace these with your actual test credentials as needed.

4. **Security**: Sensitive variables like passwords and auth tokens are marked as "secret" type in Postman.

5. **Collection Variables**: The collection has default variables that serve as fallbacks, but environment variables take precedence.

## Testing Workflow

### Development Testing
1. Select "Traveloop Development" environment
2. Run "Sign Up" to create a test user
3. Run "Login" to authenticate (token auto-captured)
4. Test other endpoints using the captured token

### Production Testing
1. Select "Traveloop Production" environment
2. Fill in production credentials and trip IDs
3. Run "Login" to authenticate
4. Test endpoints against production server

## Important Notes

- Never commit actual production credentials to version control
- The production environment file contains placeholder values that must be updated
- Always test in development first before running against production
- The `auth_token` variable is automatically populated by the Login request
- Environment variables override collection variables in Postman
