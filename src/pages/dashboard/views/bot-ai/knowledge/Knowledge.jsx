import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Bot, CheckCircle, XCircle } from 'lucide-react';
import './Knowledge.css';

const initialKnowledge = [
  { id: 1, intent: 'Ubicación', question: '¿Dónde están ubicados?', answer: 'Estamos ubicados en Av. Principal 123, Centro. Frente al parque central.', active: true },
  { id: 2, intent: 'Métodos de Pago', question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos efectivo, transferencias bancarias, QR y tarjetas de débito/crédito (Visa, Mastercard).', active: true },
  { id: 3, intent: 'Parqueo', question: '¿Tienen parqueo propio?', answer: 'Sí, contamos con parqueo gratuito para clientes en el subsuelo del edificio.', active: true },
  { id: 4, intent: 'Promociones', question: '¿Tienen promociones?', answer: 'Los martes tenemos 2x1 en cortes clásicos. Además, en tu primera visita te regalamos un lavado capilar.', active: false },
];

export const Knowledge = () => {
  const [entries, setEntries] = useState(initialKnowledge);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(e => 
    e.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.intent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="knowledge-container">
      <div className="knowledge-header">
        <div>
          <h1 className="page-title">Base de Conocimiento IA</h1>
          <p className="page-subtitle">Entrena a tu agente de WhatsApp con respuestas automáticas.</p>
        </div>
        <button className="btn btn-primary btn-icon">
          <Plus size={20} />
          Nuevo Registro
        </button>
      </div>

      <div className="knowledge-content">
        <div className="knowledge-sidebar">
          <div className="bot-status-card">
            <div className="bot-avatar">
              <Bot size={32} />
            </div>
            <h3>Estado del Agente</h3>
            <div className="status-badge active">Activo y Respondiendo</div>
            <p className="bot-stats">
              <strong>{entries.filter(e => e.active).length}</strong> intenciones activas
            </p>
            <button className="btn btn-secondary w-full mt-4">Pausar Agente</button>
          </div>
        </div>

        <div className="knowledge-main">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por intención o pregunta..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="entries-table-wrapper">
            <table className="entries-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Intención / Tema</th>
                  <th>Respuesta Configurada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      {entry.active ? (
                        <span className="status-icon active"><CheckCircle size={18} /></span>
                      ) : (
                        <span className="status-icon inactive"><XCircle size={18} /></span>
                      )}
                    </td>
                    <td>
                      <div className="entry-intent">{entry.intent}</div>
                      <div className="entry-question">{entry.question}</div>
                    </td>
                    <td>
                      <div className="entry-answer">{entry.answer}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit"><Edit2 size={16} /></button>
                        <button className="action-btn delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEntries.length === 0 && (
              <div className="no-results">
                No se encontraron registros para tu búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
