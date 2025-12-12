/**
 * Client Entity
 * Representa um cliente da empresa de refrigeração e elétrica
 */
class Client {
  constructor({
    id = null,
    name,
    email = null,
    phone = null,
    whatsapp = null,
    cpf_cnpj = null,
    address = null,
    address_number = null,
    address_complement = null,
    neighborhood = null,
    city = null,
    state = null,
    zip_code = null,
    latitude = null,
    longitude = null,
    notes = null,
    rating = null,
    active = true,
    created_at = null,
    updated_at = null
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.whatsapp = whatsapp;
    this.cpf_cnpj = cpf_cnpj;
    this.address = address;
    this.address_number = address_number;
    this.address_complement = address_complement;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zip_code = zip_code;
    this.latitude = latitude;
    this.longitude = longitude;
    this.notes = notes;
    this.rating = rating;
    this.active = active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Valida os dados do cliente
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (this.rating && (this.rating < 1 || this.rating > 5)) {
      errors.push('Rating deve estar entre 1 e 5');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Retorna endereço completo formatado
   */
  getFullAddress() {
    const parts = [];
    
    if (this.address) parts.push(this.address);
    if (this.address_number) parts.push(this.address_number);
    if (this.address_complement) parts.push(this.address_complement);
    if (this.neighborhood) parts.push(this.neighborhood);
    if (this.city) parts.push(this.city);
    if (this.state) parts.push(this.state);
    if (this.zip_code) parts.push(`CEP: ${this.zip_code}`);

    return parts.filter(p => p).join(', ');
  }

  /**
   * Converte para objeto plano
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      whatsapp: this.whatsapp,
      cpf_cnpj: this.cpf_cnpj,
      address: this.address,
      address_number: this.address_number,
      address_complement: this.address_complement,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      zip_code: this.zip_code,
      latitude: this.latitude,
      longitude: this.longitude,
      notes: this.notes,
      rating: this.rating,
      active: this.active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Client;
