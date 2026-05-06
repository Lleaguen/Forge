import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/modules/auth/infrastructure/security/jwt-auth.guard'
import { ResponseUtil } from '@/shared/utils/response.util'
import { PrismaService } from '@/shared/database/prisma.service'
import { NotificationsService } from '@/modules/notifications/notifications.service'
import { randomBytes } from 'crypto'

interface InviteMemberDto {
  email: string
  role?: 'ADMIN' | 'MEMBER'
}

interface UpdateMemberDto {
  role: 'ADMIN' | 'MEMBER'
}

interface AcceptInvitationDto {
  token: string
}

@Controller('project-members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService
  ) {
    console.log('🚀 ProjectMembersController initialized')
  }

  @Get(':projectId/members')
  async getProjectMembers(@Param('projectId') projectId: string, @Request() req: any) {
    console.log('🔍 Getting members for project:', projectId)
    try {
      // Verify user has access to this project
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organization: {
            memberships: {
              some: { userId: req.user.sub }
            }
          }
        }
      })

      if (!project) {
        return ResponseUtil.error('Project not found or access denied')
      }

      // Get project members through organization memberships
      const members = await this.prisma.membership.findMany({
        where: {
          organizationId: project.organizationId
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true
            }
          }
        }
      })

      // Transform to match frontend interface
      const transformedMembers = members.map(member => ({
        id: member.id,
        userId: member.userId,
        projectId: projectId,
        role: member.role,
        joinedAt: new Date().toISOString(),
        user: member.user
      }))

      return ResponseUtil.success(transformedMembers)
    } catch (error) {
      console.error('Error fetching project members:', error)
      return ResponseUtil.error('Failed to fetch project members')
    }
  }

  @Post(':projectId/invite')
  async inviteProjectMember(
    @Param('projectId') projectId: string,
    @Body() dto: InviteMemberDto,
    @Request() req: any
  ) {
    try {
      // Verify user has admin access to this project
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organization: {
            memberships: {
              some: { 
                userId: req.user.sub,
                role: { in: ['OWNER', 'ADMIN'] }
              }
            }
          }
        }
      })

      if (!project) {
        return ResponseUtil.error('Project not found or insufficient permissions')
      }

      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email }
      })

      // Check if email is already a member of the organization
      const existingUser = user
      if (existingUser) {
        const existingMembership = await this.prisma.membership.findUnique({
          where: {
            userId_organizationId: {
              userId: existingUser.id,
              organizationId: project.organizationId!
            }
          }
        })

        if (existingMembership) {
          return ResponseUtil.error('User is already a member of this organization')
        }
      }

      // Check if there's already a pending invitation
      const existingInvitation = await this.prisma.invitation.findFirst({
        where: {
          email: dto.email,
          organizationId: project.organizationId!,
          projectId: projectId,
          status: 'PENDING'
        }
      })

      if (existingInvitation) {
        return ResponseUtil.error('There is already a pending invitation for this email')
      }

      // Create invitation
      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

      const invitation = await this.prisma.invitation.create({
        data: {
          email: dto.email,
          organizationId: project.organizationId!,
          projectId: projectId,
          role: dto.role || 'MEMBER',
          invitedById: req.user.sub,
          invitedUserId: existingUser?.id,
          token: token,
          expiresAt: expiresAt,
          status: 'PENDING'
        },
        include: {
          invitedBy: {
            select: {
              fullName: true,
              email: true
            }
          },
          project: {
            select: {
              name: true
            }
          },
          organization: {
            select: {
              name: true
            }
          }
        }
      })

      // If user exists, create a notification
      if (existingUser) {
        try {
          const notification = await this.notificationsService.createProjectInvitationNotification(
            existingUser.id,
            invitation.id,
            invitation.project?.name || 'Proyecto',
            invitation.invitedBy?.fullName || invitation.invitedBy?.email || 'Alguien',
            token
          )
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError)
        }
      }

      return ResponseUtil.success({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        projectName: invitation.project?.name,
        organizationName: invitation.organization?.name,
        invitedBy: invitation.invitedBy?.fullName || invitation.invitedBy?.email,
        expiresAt: invitation.expiresAt
      }, 'Invitation sent successfully')
    } catch (error) {
      console.error('Error inviting project member:', error)
      return ResponseUtil.error('Failed to send invitation')
    }
  }

  @Patch(':projectId/members/:memberId')
  async updateProjectMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberDto,
    @Request() req: any
  ) {
    try {
      // Verify user has admin access to this project
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organization: {
            memberships: {
              some: { 
                userId: req.user.sub,
                role: { in: ['OWNER', 'ADMIN'] }
              }
            }
          }
        }
      })

      if (!project) {
        return ResponseUtil.error('Project not found or insufficient permissions')
      }

      // Update membership role
      const membership = await this.prisma.membership.update({
        where: {
          id: memberId,
          organizationId: project.organizationId!
        },
        data: {
          role: dto.role
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true
            }
          }
        }
      })

      // Transform response
      const transformedMember = {
        id: membership.id,
        userId: membership.userId,
        projectId: projectId,
        role: membership.role,
        joinedAt: new Date().toISOString(),
        user: membership.user
      }

      return ResponseUtil.success(transformedMember, 'Member role updated successfully')
    } catch (error) {
      console.error('Error updating project member:', error)
      return ResponseUtil.error('Failed to update member')
    }
  }

  @Delete(':projectId/members/:memberId')
  async removeProjectMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Request() req: any
  ) {
    try {
      // Verify user has admin access to this project
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organization: {
            memberships: {
              some: { 
                userId: req.user.sub,
                role: { in: ['OWNER', 'ADMIN'] }
              }
            }
          }
        }
      })

      if (!project) {
        return ResponseUtil.error('Project not found or insufficient permissions')
      }

      // Check if trying to remove owner
      const membership = await this.prisma.membership.findUnique({
        where: { id: memberId }
      })

      if (membership?.role === 'OWNER') {
        return ResponseUtil.error('Cannot remove project owner')
      }

      // Remove membership
      await this.prisma.membership.delete({
        where: {
          id: memberId,
          organizationId: project.organizationId!
        }
      })

      return ResponseUtil.success(null, 'Member removed successfully')
    } catch (error) {
      console.error('Error removing project member:', error)
      return ResponseUtil.error('Failed to remove member')
    }
  }

  @Get(':projectId/invitations')
  async getProjectInvitations(@Param('projectId') projectId: string, @Request() req: any) {
    console.log('📋 Getting invitations for project:', projectId)
    try {
      // Verify user has access to this project
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          organization: {
            memberships: {
              some: { userId: req.user.sub }
            }
          }
        }
      })

      if (!project) {
        return ResponseUtil.error('Project not found or access denied')
      }

      const invitations = await this.prisma.invitation.findMany({
        where: {
          projectId: projectId,
          status: 'PENDING'
        },
        include: {
          invitedBy: {
            select: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Transform invitations to match frontend interface
      const transformedInvitations = invitations.map(invitation => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        invitedBy: invitation.invitedBy?.fullName || invitation.invitedBy?.email || 'Alguien',
        expiresAt: invitation.expiresAt,
        createdAt: invitation.createdAt
      }))

      return ResponseUtil.success(transformedInvitations)
    } catch (error) {
      console.error('Error fetching project invitations:', error)
      return ResponseUtil.error('Failed to fetch invitations')
    }
  }

  @Post('invitations/:token/accept')
  async acceptInvitation(@Param('token') token: string, @Request() req: any) {
    console.log('✅ Accepting invitation with token:', token)
    try {
      const invitation = await this.prisma.invitation.findUnique({
        where: { token },
        include: {
          organization: true,
          project: true
        }
      })

      if (!invitation) {
        return ResponseUtil.error('Invitation not found')
      }

      if (invitation.status !== 'PENDING') {
        return ResponseUtil.error('Invitation is no longer valid')
      }

      if (invitation.expiresAt < new Date()) {
        await this.prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: 'EXPIRED' }
        })
        return ResponseUtil.error('Invitation has expired')
      }

      // Check if user email matches invitation email
      if (req.user.email !== invitation.email) {
        return ResponseUtil.error('This invitation is not for your email address')
      }

      // Check if user is already a member
      const existingMembership = await this.prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: req.user.sub,
            organizationId: invitation.organizationId
          }
        }
      })

      if (existingMembership) {
        await this.prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: 'ACCEPTED', acceptedAt: new Date() }
        })
        return ResponseUtil.error('You are already a member of this organization')
      }

      // Create membership
      const membership = await this.prisma.membership.create({
        data: {
          userId: req.user.sub,
          organizationId: invitation.organizationId,
          role: invitation.role
        }
      })

      // Update invitation status
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { 
          status: 'ACCEPTED', 
          acceptedAt: new Date(),
          invitedUserId: req.user.sub
        }
      })

      return ResponseUtil.success({
        membership,
        project: invitation.project,
        organization: invitation.organization
      }, 'Invitation accepted successfully')
    } catch (error) {
      console.error('Error accepting invitation:', error)
      return ResponseUtil.error('Failed to accept invitation')
    }
  }

  @Post('invitations/:token/reject')
  async rejectInvitation(@Param('token') token: string, @Request() req: any) {
    console.log('❌ Rejecting invitation with token:', token)
    try {
      const invitation = await this.prisma.invitation.findUnique({
        where: { token }
      })

      if (!invitation) {
        return ResponseUtil.error('Invitation not found')
      }

      if (invitation.status !== 'PENDING') {
        return ResponseUtil.error('Invitation is no longer valid')
      }

      // Check if user email matches invitation email
      if (req.user.email !== invitation.email) {
        return ResponseUtil.error('This invitation is not for your email address')
      }

      // Update invitation status
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { 
          status: 'REJECTED', 
          rejectedAt: new Date(),
          invitedUserId: req.user.sub
        }
      })

      return ResponseUtil.success(null, 'Invitation rejected')
    } catch (error) {
      console.error('Error rejecting invitation:', error)
      return ResponseUtil.error('Failed to reject invitation')
    }
  }
}