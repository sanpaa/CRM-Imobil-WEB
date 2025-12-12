/**
 * Order Entity
 * Representa uma Ordem de Serviço (OS)
 */
class Order {
  constructor({
    id = null,
    order_number = null,
    client_id,
    technician_id = null,
    service_id = null,
    type,
    equipment = null,
    problem_description,
    solution_description = null,
    status = 'open',
    priority = 'normal',
    scheduled_date = null,
    started_at = null,
    completion_date = null,
    latitude = null,
    longitude = null,
    address = null,
    notes = null,
    internal_notes = null,
    estimated_cost = null,
    final_cost = null,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.order_number = order_number;
    this.client_id = client_id;
    this.technician_id = technician_id;
    this.service_id = service_id;
    this.type = type;
    this.equipment = equipment;
    this.problem_description = problem_description;
    this.solution_description = solution_description;
    this.status = status;
    this.priority = priority;
    this.scheduled_date = scheduled_date;
    this.started_at = started_at;
    this.completion_date = completion_date;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.notes = notes;
    this.internal_notes = internal_notes;
    this.estimated_cost = estimated_cost;
    this.final_cost = final_cost;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Valida os dados da ordem de serviço
   */
  validate() {
    const errors = [];

    if (!this.client_id) {
      errors.push('Cliente é obrigatório');
    }

    if (!this.type || !['refrigeration', 'electrical'].includes(this.type)) {
      errors.push('Tipo de serviço inválido (refrigeration ou electrical)');
    }

    if (!this.problem_description || this.problem_description.trim().length === 0) {
      errors.push('Descrição do problema é obrigatória');
    }

    if (this.status && !this.isValidStatus(this.status)) {
      errors.push('Status inválido');
    }

    if (this.priority && !this.isValidPriority(this.priority)) {
      errors.push('Prioridade inválida');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida status
   */
  isValidStatus(status) {
    const validStatuses = ['open', 'in_progress', 'waiting_parts', 'completed', 'cancelled'];
    return validStatuses.includes(status);
  }

  /**
   * Valida prioridade
   */
  isValidPriority(priority) {
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    return validPriorities.includes(priority);
  }

  /**
   * Atualiza status da ordem
   */
  updateStatus(newStatus) {
    if (!this.isValidStatus(newStatus)) {
      throw new Error('Status inválido');
    }

    this.status = newStatus;

    // Atualizar timestamps automáticos
    if (newStatus === 'in_progress' && !this.started_at) {
      this.started_at = new Date();
    }

    if (newStatus === 'completed' && !this.completion_date) {
      this.completion_date = new Date();
    }
  }

  /**
   * Verifica se a ordem está aberta
   */
  isOpen() {
    return this.status === 'open';
  }

  /**
   * Verifica se a ordem está em andamento
   */
  isInProgress() {
    return this.status === 'in_progress';
  }

  /**
   * Verifica se a ordem está concluída
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Verifica se a ordem foi cancelada
   */
  isCancelled() {
    return this.status === 'cancelled';
  }

  /**
   * Retorna ícone baseado no tipo de serviço
   */
  getTypeIcon() {
    return this.type === 'refrigeration' ? '❄️' : '⚡';
  }

  /**
   * Retorna cor baseada no status
   */
  getStatusColor() {
    const colors = {
      open: '#FFA500',
      in_progress: '#1E90FF',
      waiting_parts: '#FFD700',
      completed: '#32CD32',
      cancelled: '#DC143C'
    };
    return colors[this.status] || '#999999';
  }

  /**
   * Converte para objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      order_number: this.order_number,
      client_id: this.client_id,
      technician_id: this.technician_id,
      service_id: this.service_id,
      type: this.type,
      equipment: this.equipment,
      problem_description: this.problem_description,
      solution_description: this.solution_description,
      status: this.status,
      priority: this.priority,
      scheduled_date: this.scheduled_date,
      started_at: this.started_at,
      completion_date: this.completion_date,
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
      notes: this.notes,
      internal_notes: this.internal_notes,
      estimated_cost: this.estimated_cost,
      final_cost: this.final_cost,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Order;
