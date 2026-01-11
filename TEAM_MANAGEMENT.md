# Team Management & Authentication Features

## Overview
Complete team management system with invites, account creation, and password reset functionality. Ready for Postmark email integration.

## Features Implemented

### 1. Team Management
- **Invite team members** via email
- **Role-based access control**: OWNER, ADMIN, EDITOR, VIEWER
- **Pending invites** with resend functionality
- **Remove team members**
- **Accept invites** and create accounts

### 2. Password Reset
- **Forgot password** flow
- **Reset token** generation and validation
- **Token expiration** (1 hour)
- **Secure password reset**

### 3. Account Creation
- **Team member registration** via invite link
- **Automatic account creation** on invite acceptance
- **JWT authentication** on signup

## Database Schema

### New Models

#### TeamMember
```prisma
model TeamMember {
  id          String    @id @default(cuid())
  storeId     String
  userId      String?
  email       String
  role        TeamRole  @default(VIEWER)
  inviteToken String?   @unique
  invitedAt   DateTime  @default(now())
  acceptedAt  DateTime?
  invitedBy   String
  
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)
  user  User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([storeId, email])
  @@index([storeId])
  @@index([email])
  @@index([inviteToken])
}
```

#### TeamRole Enum
```prisma
enum TeamRole {
  OWNER
  ADMIN
  EDITOR
  VIEWER
}
```

### Updated Models

#### User
Added password reset fields:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      UserRole @default(STORE)
  resetToken String?
  resetTokenExpiry DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  teamMemberships TeamMember[]
  // ... other relations
}
```

## Backend API Routes

### Team Management (`/api/team`)

#### `GET /api/team`
Get all team members for the current store.
- **Auth**: Required (STORE role)
- **Returns**: Array of team members

#### `POST /api/team/invite`
Invite a new team member.
- **Auth**: Required (STORE role)
- **Body**: `{ email: string, role: 'ADMIN' | 'EDITOR' | 'VIEWER' }`
- **Returns**: Team member object and invite link
- **Note**: Will send email via Postmark (to be implemented)

#### `GET /api/team/invite/:token`
Get invite details by token (public route).
- **Auth**: Not required
- **Returns**: Invite details (email, role, store info)

#### `POST /api/team/accept-invite`
Accept an invite and create account.
- **Auth**: Not required
- **Body**: `{ token: string, password: string }`
- **Returns**: JWT token and user object

#### `PATCH /api/team/:memberId`
Update team member role.
- **Auth**: Required (STORE role)
- **Body**: `{ role: 'ADMIN' | 'EDITOR' | 'VIEWER' }`
- **Returns**: Updated team member

#### `DELETE /api/team/:memberId`
Remove a team member.
- **Auth**: Required (STORE role)
- **Returns**: Success message

#### `POST /api/team/:memberId/resend`
Resend an invite to a pending team member.
- **Auth**: Required (STORE role)
- **Returns**: New invite link
- **Note**: Will send email via Postmark (to be implemented)

### Password Reset (`/api/auth`)

#### `POST /api/auth/forgot-password`
Request a password reset.
- **Auth**: Not required
- **Body**: `{ email: string }`
- **Returns**: Success message (doesn't reveal if email exists)
- **Note**: Will send email via Postmark (to be implemented)

#### `POST /api/auth/reset-password`
Reset password with token.
- **Auth**: Not required
- **Body**: `{ token: string, password: string }`
- **Returns**: Success message

#### `GET /api/auth/verify-reset-token/:token`
Verify if a reset token is valid.
- **Auth**: Not required
- **Returns**: Email and validation status

## Frontend Pages

### Team Management
- **`/store-dashboard/settings`** - Team tab with invite modal
  - View all team members
  - Invite new members
  - Resend invites
  - Remove members
  - Role descriptions

### Invite Acceptance
- **`/team/accept-invite?token=xxx`**
  - View invite details
  - Create account with password
  - Auto-login after acceptance

### Password Reset
- **`/forgot-password`**
  - Request password reset
  - Shows success message

- **`/reset-password?token=xxx`**
  - Verify reset token
  - Set new password
  - Success confirmation

- **`/login`**
  - Added "Forgot password?" link

## Team Roles & Permissions

### OWNER
- Store owner (original creator)
- Full access to everything
- Cannot be removed

### ADMIN
- Full access to all store settings
- Can manage team members
- Can view and edit all data

### EDITOR
- Can manage products
- Can view analytics
- Cannot manage team or billing

### VIEWER
- Read-only access to store data
- Can view analytics
- Cannot edit anything

## Postmark Email Integration

### Email Templates Needed

#### 1. Team Invite Email
**Trigger**: `POST /api/team/invite`

**Template Variables**:
```javascript
{
  storeName: string,
  storeLogoUrl: string,
  invitedBy: string,
  role: string,
  inviteLink: string,
  expiresIn: string
}
```

**Sample Content**:
```
Subject: You've been invited to join {storeName}

Hi,

{invitedBy} has invited you to join {storeName} as a {role}.

Click the link below to accept your invitation and create your account:
{inviteLink}

Role: {role}
- [Description of role permissions]

This invitation will expire in {expiresIn}.

Best regards,
The Livero Team
```

#### 2. Password Reset Email
**Trigger**: `POST /api/auth/forgot-password`

**Template Variables**:
```javascript
{
  email: string,
  resetLink: string,
  expiresIn: string
}
```

**Sample Content**:
```
Subject: Reset your Livero password

Hi,

You requested to reset your password for {email}.

Click the link below to reset your password:
{resetLink}

This link will expire in {expiresIn} (1 hour).

If you didn't request this, please ignore this email.

Best regards,
The Livero Team
```

### Implementation Steps for Postmark

1. **Install Postmark client**:
```bash
cd backend
npm install postmark
```

2. **Add to `.env`**:
```
POSTMARK_SERVER_TOKEN=your_token_here
FRONTEND_URL=http://localhost:3000
```

3. **Update routes to send emails**:

In `team.routes.ts` (line ~70):
```typescript
import { ServerClient } from 'postmark';
const postmark = new ServerClient(process.env.POSTMARK_SERVER_TOKEN!);

// In POST /invite
await postmark.sendEmailWithTemplate({
  From: 'noreply@livero.com',
  To: email,
  TemplateId: YOUR_TEMPLATE_ID,
  TemplateModel: {
    storeName: store.name,
    storeLogoUrl: store.logoUrl,
    invitedBy: store.user.email,
    role,
    inviteLink,
    expiresIn: '30 days',
  },
});
```

In `auth.routes.ts` (line ~150):
```typescript
// In POST /forgot-password
await postmark.sendEmailWithTemplate({
  From: 'noreply@livero.com',
  To: email,
  TemplateId: YOUR_TEMPLATE_ID,
  TemplateModel: {
    email,
    resetLink,
    expiresIn: '1 hour',
  },
});
```

## Security Considerations

### Token Generation
- Uses `crypto.randomBytes(32)` for secure token generation
- Tokens are unique and unpredictable

### Password Requirements
- Minimum 6 characters (can be increased)
- Hashed with bcrypt (10 rounds)

### Reset Token Expiration
- Expires in 1 hour
- Single-use only (cleared after use)

### Invite Token
- No expiration (can be added)
- Cleared after acceptance
- Cannot be reused

### Email Privacy
- Password reset doesn't reveal if email exists
- Consistent messaging for security

## Testing the Features

### Team Management

1. **Invite a team member**:
   - Go to `/store-dashboard/settings`
   - Click "Team" tab
   - Click "Invite Member"
   - Enter email and select role
   - Copy the invite link from console
   - Check for invite link in response

2. **Accept invite**:
   - Open invite link in incognito/new browser
   - Should see store name and role
   - Create password and submit
   - Should auto-login to dashboard

3. **Resend invite**:
   - As store owner, click "Resend Invite"
   - New token generated
   - Check console for new link

4. **Remove member**:
   - Click "Remove" on any member
   - Confirm deletion
   - Member removed from list

### Password Reset

1. **Request reset**:
   - Go to `/login`
   - Click "Forgot password?"
   - Enter email
   - Copy reset link from console

2. **Reset password**:
   - Open reset link
   - Should see email
   - Enter new password
   - Submit and confirm success

3. **Test token expiration**:
   - In database, set `resetTokenExpiry` to past date
   - Try to use reset link
   - Should show "Invalid or expired" error

## Migration

Database migration already applied:
```
20260111215325_add_team_and_password_reset
```

Includes:
- TeamRole enum
- TeamMember model
- User reset fields
- Store teamMembers relation

## Next Steps

1. **Install and configure Postmark** (see above)
2. **Create email templates** in Postmark dashboard
3. **Add template IDs** to environment variables
4. **Update routes** to send actual emails
5. **Test email delivery** end-to-end

## Files Changed

### Backend
- `/backend/prisma/schema.prisma` - Added TeamMember, TeamRole, reset fields
- `/backend/src/routes/team.routes.ts` - New file, all team endpoints
- `/backend/src/routes/auth.routes.ts` - Added password reset routes
- `/backend/src/index.ts` - Registered team routes

### Frontend
- `/app/team/accept-invite/page.tsx` - New page for accepting invites
- `/app/forgot-password/page.tsx` - New page for password reset request
- `/app/reset-password/page.tsx` - New page for setting new password
- `/app/login/page.tsx` - Added forgot password link
- `/app/store-dashboard/settings/page.tsx` - Added team management UI

## Development URLs

- Login: `http://localhost:3000/login`
- Forgot Password: `http://localhost:3000/forgot-password`
- Reset Password: `http://localhost:3000/reset-password?token=xxx`
- Accept Invite: `http://localhost:3000/team/accept-invite?token=xxx`
- Store Settings: `http://localhost:3000/store-dashboard/settings`

