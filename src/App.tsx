import React, { useState, useEffect } from 'react'
import { Plus, Search, Copy, Edit, Trash, Check, X } from 'lucide-react'

interface ITItem {
  id: string;
  title: string;
  content: string;
  category: string;
}

const CATEGORIES = ['Geral', 'Saudação', 'Rede', 'Hardware', 'Software', 'Acessos'];

function App() {
  const [items, setItems] = useState<ITItem[]>([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<ITItem | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Geral' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('it-support-items');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const defaultItems = [
        { id: '1', title: 'Saudação Padrão', content: 'Olá, tudo bem? Sou do suporte de TI. Como posso te ajudar hoje?', category: 'Saudação' },
        { id: '2', title: 'Limpeza de Cache', content: 'Por favor, pressione Ctrl+F5 no seu navegador para limpar o cache e tente novamente.', category: 'Software' }
      ];
      setItems(defaultItems);
      localStorage.setItem('it-support-items', JSON.stringify(defaultItems));
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('it-support-items', JSON.stringify(items));
    }
  }, [items]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentItem) {
      setItems(items.map(item => item.id === currentItem.id ? { ...formData, id: item.id } : item));
    } else {
      const newItem = { ...formData, id: Date.now().toString() };
      setItems([newItem, ...items]);
    }
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ title: '', content: '', category: 'Geral' });
  };

  const startEdit = (item: ITItem) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({ title: item.title, content: item.content, category: item.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = (id: string) => {
    if (confirm('Deseja realmente excluir este item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.content.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', paddingBottom: '2rem' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#ff6600', color: 'white', padding: '1rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Painel TI Copia & Cola</h1>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ff6600' }} size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar mensagens..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '25px', border: 'none', width: '300px', outline: 'none', color: '#333' }}
            />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Form Section */}
        <section style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
          <h2 style={{ color: '#ff6600', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            {isEditing ? 'Editar Mensagem' : 'Adicionar Nova Mensagem'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Título</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Reset de Senha"
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Categoria</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', backgroundColor: 'white' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Conteúdo da Mensagem</label>
              <textarea 
                required
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Digite o texto que será copiado..."
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#ff6600', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.8rem 1.5rem', 
                  borderRadius: '8px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {isEditing ? 'Salvar' : 'Adicionar'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(false); setFormData({ title: '', content: '', category: 'Geral' }); }}
                  style={{ backgroundColor: '#666', color: 'white', border: 'none', padding: '0.8rem 1rem', borderRadius: '8px' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* List Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '5px solid #ff6600', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', position: 'relative' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#fff0e6', color: '#ff6600', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{item.category}</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(item)} style={{ background: 'none', border: 'none', color: '#666', padding: 0 }}><Edit size={16} /></button>
                    <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: '#ff4444', padding: 0 }}><Trash size={16} /></button>
                  </div>
                </div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#555', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                  {item.content}
                </p>
              </div>
              <button 
                onClick={() => handleCopy(item.content, item.id)}
                style={{ 
                  backgroundColor: copiedId === item.id ? '#4CAF50' : '#ff6600', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.7rem', 
                  borderRadius: '8px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  transition: 'background-color 0.3s'
                }}
              >
                {copiedId === item.id ? <><Check size={18} /> Copiado!</> : <><Copy size={18} /> Copiar Texto</>}
              </button>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
            Nenhuma mensagem encontrada.
          </div>
        )}
      </main>
    </div>
  )
}

export default App
