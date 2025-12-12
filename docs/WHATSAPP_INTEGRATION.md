# 💬 Integração WhatsApp - Guia Completo (Gratuito)

## 📋 Visão Geral

Este documento descreve como integrar o sistema com WhatsApp usando soluções **100% gratuitas**.

## 🎯 Opção Recomendada: Baileys ⭐

**Baileys** é uma biblioteca Node.js que se conecta ao WhatsApp Web de forma programática.

### Instalação:

```bash
npm install @whiskeysockets/baileys @hapi/boom
```

### Implementação Completa:

Ver arquivo: `src/infrastructure/whatsapp/baileys-adapter.js`

### Templates de Mensagens:

Ver arquivo: `src/application/services/WhatsAppService.js`

## 📝 Templates Disponíveis

1. **Confirmação de Agendamento** - Enviado ao criar OS
2. **Lembrete de Visita** - 24h antes do agendamento
3. **Envio de Orçamento** - Ao criar orçamento
4. **Serviço Concluído** - Ao finalizar OS
5. **Aguardando Aprovação** - Lembrete de orçamento pendente

## 🚀 Como Usar

```javascript
const whatsappService = new WhatsAppService();
await whatsappService.initialize();
// Escanear QR Code
// Aguardar conexão

// Enviar mensagem
await whatsappService.sendScheduleConfirmation(order, client, technician);
```

## ⚠️ Aviso Importante

Esta é uma solução **não oficial**. Para uso comercial em larga escala, considere a API oficial do WhatsApp Business.

**Criado em**: 12/12/2025
