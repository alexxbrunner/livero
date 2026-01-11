import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get team members for current store
router.get('/', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const teamMembers = await prisma.teamMember.findMany({
      where: { storeId: store.id },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { invitedAt: 'desc' },
    });

    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Invite team member
router.post('/invite', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
      include: { user: true },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if already invited
    const existing = await prisma.teamMember.findUnique({
      where: {
        storeId_email: {
          storeId: store.id,
          email: email.toLowerCase(),
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'User already invited to this store' });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Create team member invite
    const teamMember = await prisma.teamMember.create({
      data: {
        storeId: store.id,
        email: email.toLowerCase(),
        role,
        inviteToken,
        invitedBy: req.user!.userId,
      },
    });

    // TODO: Send email via Postmark
    // For now, return invite link
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/team/accept-invite?token=${inviteToken}`;

    res.json({
      teamMember,
      inviteLink,
      message: 'Invitation created successfully. Email will be sent via Postmark.',
    });
  } catch (error) {
    console.error('Error inviting team member:', error);
    res.status(500).json({ error: 'Failed to invite team member' });
  }
});

// Get invite details by token (public route for accepting invites)
router.get('/invite/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const invite = await prisma.teamMember.findUnique({
      where: { inviteToken: token },
      include: {
        store: {
          select: {
            name: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found or expired' });
    }

    if (invite.acceptedAt) {
      return res.status(400).json({ error: 'Invite already accepted' });
    }

    res.json({
      email: invite.email,
      role: invite.role,
      storeName: invite.store.name,
      storeLogoUrl: invite.store.logoUrl,
    });
  } catch (error) {
    console.error('Error fetching invite:', error);
    res.status(500).json({ error: 'Failed to fetch invite' });
  }
});

// Accept invite and create account
router.post('/accept-invite', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const invite = await prisma.teamMember.findUnique({
      where: { inviteToken: token },
    });

    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    if (invite.acceptedAt) {
      return res.status(400).json({ error: 'Invite already accepted' });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (!user) {
      // Create new user account
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          email: invite.email,
          password: hashedPassword,
          role: 'STORE', // Team members have STORE role but access through team membership
        },
      });
    }

    // Update team member with user ID and acceptance
    await prisma.teamMember.update({
      where: { id: invite.id },
      data: {
        userId: user.id,
        acceptedAt: new Date(),
        inviteToken: null, // Clear token after acceptance
      },
    });

    // Generate JWT for login
    const jwt = require('jsonwebtoken');
    const token_jwt = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token: token_jwt,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: 'Invite accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting invite:', error);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

// Update team member role
router.patch('/:memberId', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { memberId } = req.params;
    const { role } = req.body;

    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Verify team member belongs to this store
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        storeId: store.id,
      },
    });

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Update role
    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Remove team member
router.delete('/:memberId', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { memberId } = req.params;

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Verify team member belongs to this store
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        storeId: store.id,
      },
    });

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error removing team member:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
});

// Resend invite
router.post('/:memberId/resend', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { memberId } = req.params;

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const teamMember = await prisma.teamMember.findFirst({
      where: {
        id: memberId,
        storeId: store.id,
      },
    });

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    if (teamMember.acceptedAt) {
      return res.status(400).json({ error: 'Invite already accepted' });
    }

    // Generate new token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    await prisma.teamMember.update({
      where: { id: memberId },
      data: { inviteToken },
    });

    // TODO: Send email via Postmark
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/team/accept-invite?token=${inviteToken}`;

    res.json({
      inviteLink,
      message: 'Invite resent successfully. Email will be sent via Postmark.',
    });
  } catch (error) {
    console.error('Error resending invite:', error);
    res.status(500).json({ error: 'Failed to resend invite' });
  }
});

export default router;

