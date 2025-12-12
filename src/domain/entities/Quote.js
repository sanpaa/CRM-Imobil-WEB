/**
 * Quote Entity
 * Representa um Orçamento
 */
class Quote {
  constructor({
    id = null,
    quote_number = null,
    client_id,
    order_id = null,
    created_by = null,
    items = [],
    subtotal = 0,
    discount = 0,
    total = 0,
    status = 'pending',
    valid_until = null,
    sent_at = null,
    approved_at = null,
    rejected_at = null,
    notes = null,
    terms_conditions = null,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.quote_number = quote_number;
    this.client_id = client_id;
    this.order_id = order_id;
    this.created_by = created_by;
    this.items = items;
    this.subtotal = subtotal;
    this.discount = discount;
    this.total = total;
    this.status = status;
    this.valid_until = valid_until;
    this.sent_at = sent_at;
    this.approved_at = approved_at;
    this.rejected_at = rejected_at;
    this.notes = notes;
    this.terms_conditions = terms_conditions;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Valida os dados do orçamento
   */
  validate() {
    const errors = [];

    if (!this.client_id) {
      errors.push('Cliente é obrigatório');
    }

    if (!this.items || this.items.length === 0) {
      errors.push('Orçamento deve ter pelo menos um item');
    }

    if (this.items && this.items.length > 0) {
      this.items.forEach((item, index) => {
        if (!item.description) {
          errors.push(`Item ${index + 1}: descrição é obrigatória`);
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push(`Item ${index + 1}: quantidade deve ser maior que zero`);
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors.push(`Item ${index + 1}: preço unitário deve ser maior que zero`);
        }
      });
    }

    if (this.status && !this.isValidStatus(this.status)) {
      errors.push('Status inválido');
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
    const validStatuses = ['pending', 'sent', 'approved', 'rejected', 'expired'];
    return validStatuses.includes(status);
  }

  /**
   * Calcula valores do orçamento
   */
  calculateValues() {
    this.subtotal = this.items.reduce((sum, item) => {
      const itemTotal = (item.quantity || 0) * (item.unit_price || 0);
      return sum + itemTotal;
    }, 0);

    this.total = this.subtotal - (this.discount || 0);
    
    // Garantir que o total não seja negativo
    if (this.total < 0) {
      this.total = 0;
    }

    return {
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total
    };
  }

  /**
   * Adiciona item ao orçamento
   */
  addItem(item) {
    if (!item.description || !item.quantity || !item.unit_price) {
      throw new Error('Item inválido: descrição, quantidade e preço são obrigatórios');
    }

    const total = item.quantity * item.unit_price;
    this.items.push({
      ...item,
      total
    });

    this.calculateValues();
  }

  /**
   * Remove item do orçamento
   */
  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.calculateValues();
    }
  }

  /**
   * Atualiza status do orçamento
   */
  updateStatus(newStatus) {
    if (!this.isValidStatus(newStatus)) {
      throw new Error('Status inválido');
    }

    this.status = newStatus;

    // Atualizar timestamps automáticos
    if (newStatus === 'sent' && !this.sent_at) {
      this.sent_at = new Date();
    }

    if (newStatus === 'approved' && !this.approved_at) {
      this.approved_at = new Date();
    }

    if (newStatus === 'rejected' && !this.rejected_at) {
      this.rejected_at = new Date();
    }
  }

  /**
   * Verifica se o orçamento está pendente
   */
  isPending() {
    return this.status === 'pending';
  }

  /**
   * Verifica se o orçamento foi aprovado
   */
  isApproved() {
    return this.status === 'approved';
  }

  /**
   * Verifica se o orçamento foi rejeitado
   */
  isRejected() {
    return this.status === 'rejected';
  }

  /**
   * Verifica se o orçamento expirou
   */
  isExpired() {
    if (!this.valid_until) return false;
    const validDate = new Date(this.valid_until);
    return validDate < new Date();
  }

  /**
   * Formata itens para exibição
   */
  formatItems() {
    return this.items.map((item, index) => {
      return `${index + 1}. ${item.description} - ${item.quantity}x R$ ${item.unit_price.toFixed(2)} = R$ ${item.total.toFixed(2)}`;
    }).join('\n');
  }

  /**
   * Converte para objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      quote_number: this.quote_number,
      client_id: this.client_id,
      order_id: this.order_id,
      created_by: this.created_by,
      items: this.items,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      status: this.status,
      valid_until: this.valid_until,
      sent_at: this.sent_at,
      approved_at: this.approved_at,
      rejected_at: this.rejected_at,
      notes: this.notes,
      terms_conditions: this.terms_conditions,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Quote;
