import { createNotification, notifyAdmins, NotificationTemplates } from './notifications'

/**
 * Intégrations automatiques pour déclencher des notifications
 * Ces fonctions peuvent être appelées depuis d'autres modules
 */

// 🎯 PROJETS
export async function notifyProjectCreated(projectId: string, projectName: string, creatorId: string) {
  // Notifier les admins et managers
  await notifyAdmins({
    ...NotificationTemplates.PROJECT_CREATED(projectName, projectId),
    data: { creatorId, timestamp: new Date().toISOString() }
  })
}

export async function notifyProjectCompleted(projectId: string, projectName: string, completedBy: string) {
  await notifyAdmins({
    ...NotificationTemplates.PROJECT_COMPLETED(projectName, projectId),
    data: { completedBy, timestamp: new Date().toISOString() }
  })
}

// 🎫 SUPPORT
export async function notifyNewTicket(ticketId: string, ticketNumber: string, priority: string) {
  const template = priority === 'urgent' 
    ? NotificationTemplates.TICKET_URGENT(ticketNumber, ticketId)
    : NotificationTemplates.TICKET_CREATED(ticketNumber, ticketId)

  await notifyAdmins({
    ...template,
    priority: priority as 'low' | 'medium' | 'high' | 'urgent',
    data: { timestamp: new Date().toISOString() }
  })
}

// ⚡ WORKFLOWS
export async function notifyWorkflowCompleted(workflowId: string, workflowName: string) {
  await notifyAdmins({
    ...NotificationTemplates.WORKFLOW_COMPLETED(workflowName, workflowId),
    data: { timestamp: new Date().toISOString() }
  })
}

export async function notifyWorkflowFailed(workflowId: string, workflowName: string, error: string) {
  await notifyAdmins({
    ...NotificationTemplates.WORKFLOW_FAILED(workflowName, workflowId, error),
    data: { error, timestamp: new Date().toISOString() }
  })
}

// ✅ TÂCHES
export async function notifyTaskAssigned(taskId: string, taskTitle: string, assigneeId: string) {
  await createNotification({
    userId: assigneeId,
    ...NotificationTemplates.TASK_ASSIGNED(taskTitle, taskId),
    data: { timestamp: new Date().toISOString() }
  })
}

export async function notifyTaskDueSoon(taskId: string, taskTitle: string, assigneeId: string, dueDate: string) {
  await createNotification({
    userId: assigneeId,
    ...NotificationTemplates.TASK_DUE_SOON(taskTitle, taskId, dueDate),
    data: { dueDate, timestamp: new Date().toISOString() }
  })
}

// 🔧 SYSTÈME
export async function notifySystemMaintenance(message: string) {
  await notifyAdmins({
    ...NotificationTemplates.SYSTEM_MAINTENANCE(message),
    data: { timestamp: new Date().toISOString() }
  })
}

export async function notifySystemUpdate(version: string) {
  await notifyAdmins({
    ...NotificationTemplates.SYSTEM_UPDATE(version),
    data: { version, timestamp: new Date().toISOString() }
  })
}

/**
 * Fonction de test pour créer des notifications de démonstration
 */
export async function createDemoNotifications(userId: string) {
  const notifications = [
    {
      userId,
      type: 'project' as const,
      title: '📋 Nouveau projet "Site Web E-commerce"',
      message: 'Un nouveau projet a été créé et nécessite votre attention pour la planification.',
      priority: 'medium' as const,
      actionUrl: '/projects/demo-1'
    },
    {
      userId,
      type: 'task' as const,
      title: '✅ Tâche assignée: "Révision du design"',
      message: 'Une nouvelle tâche vous a été assignée avec une échéance dans 3 jours.',
      priority: 'high' as const,
      actionUrl: '/tasks/demo-2'
    },
    {
      userId,
      type: 'support' as const,
      title: '🎫 Nouveau ticket #T-2025-001',
      message: 'Un client a signalé un problème de connexion qui nécessite une réponse urgente.',
      priority: 'urgent' as const,
      actionUrl: '/support/tickets/demo-3'
    },
    {
      userId,
      type: 'workflow' as const,
      title: '⚡ Workflow "Validation automatique" terminé',
      message: 'Le processus de validation automatique s\'est exécuté avec succès.',
      priority: 'low' as const,
      actionUrl: '/admin/workflows/demo-4'
    },
    {
      userId,
      type: 'system' as const,
      title: '🆕 Mise à jour système v2.1.0',
      message: 'Le système a été mis à jour avec de nouvelles fonctionnalités de notifications.',
      priority: 'medium' as const
    }
  ]

  const results = []
  for (const notification of notifications) {
    try {
      const result = await createNotification(notification)
      results.push(result)
    } catch (error) {
      console.error('Error creating demo notification:', error)
    }
  }

  return results
}