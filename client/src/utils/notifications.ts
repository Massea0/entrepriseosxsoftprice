interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  data?: any;
  expiresAt?: Date;
}

/**
 * Créer une notification pour un utilisateur
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        priority: params.priority || 'medium',
        entity_type: params.entityType,
        entity_id: params.entityId,
        action_url: params.actionUrl,
        data: params.data || {},
        expires_at: params.expiresAt?.toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Notification created:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw error;
  }
}

/**
 * Créer des notifications pour plusieurs utilisateurs
 */
export async function createBulkNotifications(users: string[], params: Omit<CreateNotificationParams, 'userId'>) {
  try {
    const notifications = users.map(userId => ({
      user_id: userId,
      type: params.type,
      title: params.title,
      message: params.message,
      priority: params.priority || 'medium',
      entity_type: params.entityType,
      entity_id: params.entityId,
      action_url: params.actionUrl,
      data: params.data || {},
      expires_at: params.expiresAt?.toISOString()
    }));

    const response = await fetch('/api/notifications/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notifications }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ ${data.length} notifications created`);
    return data;
  } catch (error) {
    console.error('❌ Error creating bulk notifications:', error);
    throw error;
  }
}

/**
 * Créer une notification pour tous les admins
 */
export async function notifyAdmins(params: Omit<CreateNotificationParams, 'userId'>) {
  try {
    const response = await fetch('/api/notifications/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error notifying admins:', error);
    throw error;
  }
}

/**
 * Créer une notification pour une équipe/département
 */
export async function notifyTeam(departmentId: string, params: Omit<CreateNotificationParams, 'userId'>) {
  try {
    const response = await fetch(`/api/notifications/team/${departmentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error notifying team:', error);
    throw error;
  }
}

// Modèles de notifications prédéfinis
export const NotificationTemplates = {
  PROJECT_CREATED: (projectName: string, projectId: string) => ({
    type: 'project_created',
    title: '🚀 Nouveau projet créé',
    message: `Le projet "${projectName}" a été créé avec succès.`,
    priority: 'medium' as const,
    entityType: 'project',
    entityId: projectId,
    actionUrl: `/projects/${projectId}`
  }),

  PROJECT_COMPLETED: (projectName: string, projectId: string) => ({
    type: 'project_completed',
    title: '✅ Projet terminé',
    message: `Le projet "${projectName}" a été marqué comme terminé.`,
    priority: 'high' as const,
    entityType: 'project',
    entityId: projectId,
    actionUrl: `/projects/${projectId}`
  }),

  TASK_ASSIGNED: (taskTitle: string, taskId: string) => ({
    type: 'task_assigned',
    title: '📋 Nouvelle tâche assignée',
    message: `Une nouvelle tâche "${taskTitle}" vous a été assignée.`,
    priority: 'medium' as const,
    entityType: 'task',
    entityId: taskId,
    actionUrl: `/tasks/${taskId}`
  }),

  TASK_DUE_SOON: (taskTitle: string, taskId: string, dueDate: string) => ({
    type: 'task_due_soon',
    title: '⏰ Tâche à échéance proche',
    message: `La tâche "${taskTitle}" est due le ${new Date(dueDate).toLocaleDateString('fr-FR')}.`,
    priority: 'high' as const,
    entityType: 'task',
    entityId: taskId,
    actionUrl: `/tasks/${taskId}`
  }),

  WORKFLOW_COMPLETED: (workflowName: string, workflowId: string) => ({
    type: 'workflow_completed',
    title: '⚡ Workflow terminé',
    message: `Le workflow "${workflowName}" s'est terminé avec succès.`,
    priority: 'medium' as const,
    entityType: 'workflow',
    entityId: workflowId,
    actionUrl: `/workflows/${workflowId}`
  }),

  WORKFLOW_FAILED: (workflowName: string, workflowId: string, error: string) => ({
    type: 'workflow_failed',
    title: '🚨 Échec du workflow',
    message: `Le workflow "${workflowName}" a échoué : ${error}`,
    priority: 'urgent' as const,
    entityType: 'workflow',
    entityId: workflowId,
    actionUrl: `/workflows/${workflowId}`
  }),

  TICKET_CREATED: (ticketNumber: string, ticketId: string) => ({
    type: 'ticket_created',
    title: '🎫 Nouveau ticket de support',
    message: `Le ticket #${ticketNumber} a été créé.`,
    priority: 'medium' as const,
    entityType: 'ticket',
    entityId: ticketId,
    actionUrl: `/support/tickets/${ticketId}`
  }),

  TICKET_URGENT: (ticketNumber: string, ticketId: string) => ({
    type: 'ticket_urgent',
    title: '🚨 Ticket urgent',
    message: `Le ticket #${ticketNumber} nécessite une attention immédiate.`,
    priority: 'urgent' as const,
    entityType: 'ticket',
    entityId: ticketId,
    actionUrl: `/support/tickets/${ticketId}`
  }),

  SYSTEM_MAINTENANCE: (message: string) => ({
    type: 'system_maintenance',
    title: '🔧 Maintenance système',
    message: message,
    priority: 'high' as const,
    entityType: 'system',
    actionUrl: '/admin/system'
  }),

  SYSTEM_UPDATE: (version: string) => ({
    type: 'system_update',
    title: '🆕 Mise à jour système',
    message: `Le système a été mis à jour vers la version ${version}.`,
    priority: 'medium' as const,
    entityType: 'system',
    actionUrl: '/admin/system'
  })
};