import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Bot, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Knowledge.css';

// Sample entries: the texts come from the active language, the state lives here
const initialKnowledge = [
  { id: 1, active: true },
  { id: 2, active: true },
  { id: 3, active: true },
  { id: 4, active: false },
];

export const Knowledge = () => {
  const { t } = useTranslation();
  const [state] = useState(initialKnowledge);
  const [searchTerm, setSearchTerm] = useState('');

  const texts = t('dashboard.knowledge.entries', { returnObjects: true });
  const entries = state.map((entry, index) => ({ ...entry, ...(Array.isArray(texts) ? texts[index] : {}) }));

  const filteredEntries = entries.filter(e => 
    e.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.intent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="knowledge-container">
      <div className="knowledge-header">
        <div>
          <h1 className="page-title">{t('dashboard.knowledge.title')}</h1>
          <p className="page-subtitle">{t('dashboard.knowledge.subtitle')}</p>
        </div>
        <button className="btn btn-primary btn-icon">
          <Plus size={20} />
          {t('dashboard.knowledge.newEntry')}
        </button>
      </div>

      <div className="knowledge-content">
        <div className="knowledge-sidebar">
          <div className="bot-status-card">
            <div className="bot-avatar">
              <Bot size={32} />
            </div>
            <h3>{t('dashboard.knowledge.agentStatus')}</h3>
            <div className="status-badge active">{t('dashboard.knowledge.agentActive')}</div>
            <p className="bot-stats">
              <strong>{entries.filter(e => e.active).length}</strong> {t('dashboard.knowledge.activeIntents')}
            </p>
            <button className="btn btn-secondary w-full mt-4">{t('dashboard.knowledge.pauseAgent')}</button>
          </div>
        </div>

        <div className="knowledge-main">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('dashboard.knowledge.searchPlaceholder')}
              aria-label={t('dashboard.knowledge.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="entries-table-wrapper">
            <table className="entries-table">
              <thead>
                <tr>
                  <th>{t('dashboard.knowledge.columns.status')}</th>
                  <th>{t('dashboard.knowledge.columns.intent')}</th>
                  <th>{t('dashboard.knowledge.columns.answer')}</th>
                  <th>{t('dashboard.knowledge.columns.actions')}</th>
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
                        <button className="action-btn edit" aria-label={t('dashboard.knowledge.edit')}><Edit2 size={16} /></button>
                        <button className="action-btn delete" aria-label={t('dashboard.knowledge.delete')}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredEntries.length === 0 && (
              <div className="no-results">
                {t('dashboard.knowledge.noResults')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
