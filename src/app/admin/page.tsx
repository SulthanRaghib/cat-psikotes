'use client';

import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Category, Question } from '@/types';

// Extend Question type locally to include created_at
interface AdminQuestion extends Question {
  created_at?: string;
}

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Pagination & Sorting State
  const [sortOrder, setSortOrder] = useState<'terbaru' | 'terlama'>('terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'numerik' as Category,
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_index: 0,
    explanation: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'numerik': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case 'logika': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
      case 'verbal': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      case 'situasional': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      const parsed = data.questions.map((q: any) => ({
        ...q,
        options: JSON.parse(q.options)
      }));
      setQuestions(parsed);
      setCurrentPage(1); // reset to first page on fetch
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(msg);
      setTimeout(() => setError(''), 5000);
    }
  };

  // --- Export Logic ---
  const handleExportCSV = () => {
    const csvData = questions.map(q => ({
      id: q.id,
      category: q.category,
      question: q.question,
      option_a: q.options[0] || '',
      option_b: q.options[1] || '',
      option_c: q.options[2] || '',
      option_d: q.options[3] || '',
      correct_index: q.correct_index,
      explanation: q.explanation
    }));

    const csv = Papa.unparse(csvData);
    triggerDownload(csv, `bank_soal_export_${new Date().getTime()}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(questions, null, 2);
    triggerDownload(jsonStr, `bank_soal_export_${new Date().getTime()}.json`, 'application/json;charset=utf-8;');
  };

  // --- Template Logic ---
  const handleDownloadTemplateCSV = () => {
    const template = [
      {
        id: '',
        category: 'numerik',
        question: 'Berapa 2+2?',
        option_a: '2',
        option_b: '3',
        option_c: '4',
        option_d: '5',
        correct_index: 2,
        explanation: 'INFO PENTING: Kolom "category" HANYA boleh diisi salah satu dari: numerik, logika, verbal, atau situasional.'
      },
      {
        id: '',
        category: 'logika',
        question: 'Semua A adalah B. C adalah A.',
        option_a: 'C bukan B',
        option_b: 'C adalah B',
        option_c: 'A adalah C',
        option_d: 'Tidak ada',
        correct_index: 1,
        explanation: 'Contoh pengisian soal berjenis logika.'
      },
      {
        id: '',
        category: 'verbal',
        question: 'Sinonim dari BOHONG adalah?',
        option_a: 'Jujur',
        option_b: 'Dusta',
        option_c: 'Asli',
        option_d: 'Tepat',
        correct_index: 1,
        explanation: 'Contoh soal verbal.'
      },
      {
        id: '',
        category: 'situasional',
        question: 'Jika melihat genangan oli di area depo, Anda harus...',
        option_a: 'Membiarkan',
        option_b: 'Lapor petugas HSE',
        option_c: 'Difoto untuk status',
        option_d: 'Disiram air',
        correct_index: 1,
        explanation: 'Contoh soal situasional RTC (HSE).'
      }
    ];
    const csv = Papa.unparse(template);
    triggerDownload(csv, `template_import_soal.csv`, 'text/csv;charset=utf-8;');
  };

  const handleDownloadTemplateJSON = () => {
    const template = [
      {
        id: "opsional_kosongkan_saja",
        category: "numerik",
        question: "Contoh soal Numerik",
        options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
        correct_index: 0,
        explanation: "CATATAN PENTING: Nilai 'category' HANYA menerima: numerik, logika, verbal, situasional."
      },
      {
        id: "",
        category: "logika",
        question: "Contoh soal Logika",
        options: ["A", "B", "C", "D"],
        correct_index: 1,
        explanation: "Contoh soal dengan kategori logika."
      },
      {
        id: "",
        category: "verbal",
        question: "Contoh soal Verbal",
        options: ["A", "B", "C", "D"],
        correct_index: 2,
        explanation: "Contoh soal dengan kategori verbal."
      },
      {
        id: "",
        category: "situasional",
        question: "Contoh soal Situasional",
        options: ["A", "B", "C", "D"],
        correct_index: 3,
        explanation: "Contoh soal dengan kategori situasional."
      }
    ];
    triggerDownload(JSON.stringify(template, null, 2), `template_import_soal.json`, 'application/json;charset=utf-8;');
  };

  const triggerDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Import Logic ---
  const processImportedQuestions = async (formattedQuestions: any[]) => {
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: formattedQuestions })
      });

      if (res.ok) {
        showMessage(`Berhasil mengimpor ${formattedQuestions.length} soal`, 'success');
        setIsImportModalOpen(false);
        fetchQuestions();
      } else {
        const errData = await res.json();
        showMessage(`Gagal impor: ${errData.error}`, 'error');
      }
    } catch (err: any) {
      showMessage(`Kesalahan sistem: ${err.message}`, 'error');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const formattedQuestions = results.data.map((row: any) => {
              if (!row.question || !row.category) throw new Error('Data tidak lengkap di baris tertentu');
              return {
                id: row.id || null,
                category: row.category,
                question: row.question,
                options: [row.option_a, row.option_b, row.option_c, row.option_d],
                correct_index: parseInt(row.correct_index, 10) || 0,
                explanation: row.explanation || ''
              };
            });
            processImportedQuestions(formattedQuestions);
          } catch (err: any) {
            showMessage(`Format CSV tidak valid: ${err.message}`, 'error');
          }
        },
        error: (error) => showMessage(`Gagal membaca CSV: ${error.message}`, 'error')
      });
    } else if (fileExtension === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (!Array.isArray(parsed)) throw new Error('Format JSON harus berupa array');
          
          const formattedQuestions = parsed.map((row: any) => {
            if (!row.question || !row.category || !Array.isArray(row.options)) {
              throw new Error('Properti question, category, atau options tidak valid');
            }
            return {
              id: row.id || null,
              category: row.category,
              question: row.question,
              options: row.options.slice(0, 4), // Ensure max 4
              correct_index: parseInt(row.correct_index, 10) || 0,
              explanation: row.explanation || ''
            };
          });
          processImportedQuestions(formattedQuestions);
        } catch (err: any) {
          showMessage(`Format JSON tidak valid: ${err.message}`, 'error');
        }
      };
      reader.readAsText(file);
    } else {
      showMessage('Format file tidak didukung. Harap unggah CSV atau JSON.', 'error');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- CRUD Manual ---
  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({
      category: 'numerik',
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_index: 0,
      explanation: ''
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (q: AdminQuestion) => {
    setEditingId(q.id);
    setFormData({
      category: q.category,
      question: q.question,
      option_a: q.options[0] || '',
      option_b: q.options[1] || '',
      option_c: q.options[2] || '',
      option_d: q.options[3] || '',
      correct_index: q.correct_index,
      explanation: q.explanation
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus soal ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('Soal dihapus', 'success');
        fetchQuestions();
      }
    } catch (e) {
      showMessage('Gagal menghapus', 'error');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      category: formData.category,
      question: formData.question,
      options: [formData.option_a, formData.option_b, formData.option_c, formData.option_d],
      correct_index: Number(formData.correct_index),
      explanation: formData.explanation
    };

    try {
      const url = editingId ? `/api/admin/questions/${editingId}` : '/api/admin/questions';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showMessage('Berhasil menyimpan soal', 'success');
        setIsModalOpen(false);
        fetchQuestions();
      } else {
        const err = await res.json();
        showMessage(err.error || 'Gagal menyimpan', 'error');
      }
    } catch (err) {
      showMessage('Terjadi kesalahan', 'error');
    }
  };

  // --- Process Data for Render ---
  const isNewQuestion = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr + 'Z'); // SQLite returns UTC time
    const diff = Date.now() - date.getTime();
    return diff < 24 * 60 * 60 * 1000; // < 24 hours
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    // If no created_at, fallback to old date for consistent sorting
    const dateA = new Date((a.created_at || '2000-01-01') + 'Z').getTime();
    const dateB = new Date((b.created_at || '2000-01-01') + 'Z').getTime();
    return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sortedQuestions.length / itemsPerPage);
  const displayedQuestions = sortedQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#111827] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-ink dark:text-slate-100">Bank Soal</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total: <strong className="text-ink dark:text-slate-200">{questions.length}</strong> Soal Tersedia</p>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
            <select 
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as 'terbaru' | 'terlama');
                setCurrentPage(1); // reset to page 1 on sort change
              }}
              className="text-sm font-medium bg-transparent border-none text-ink dark:text-slate-200 focus:ring-0 cursor-pointer p-0 hover:text-accent transition-colors outline-none"
            >
              <option value="terbaru">Urutkan: Terbaru</option>
              <option value="terlama">Urutkan: Terlama</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-ink dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Import Data
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-accent text-white hover:bg-orange-600 rounded-xl transition-colors">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
              <button onClick={handleExportCSV} className="w-full text-left px-4 py-3 text-sm font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700/50">Export as CSV</button>
              <button onClick={handleExportJSON} className="w-full text-left px-4 py-3 text-sm font-medium text-ink dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Export as JSON</button>
            </div>
          </div>

          <button 
            onClick={openModalForAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] hover:bg-slate-800 dark:hover:bg-white rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tambah Manual
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-successBg dark:bg-success/20 text-success p-4 rounded-xl border border-success/30 flex items-center gap-3 animate-in slide-in-from-top-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-medium">{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-dangerBg dark:bg-danger/20 text-danger p-4 rounded-xl border border-danger/30 flex items-center gap-3 animate-in slide-in-from-top-2">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 font-semibold w-[140px]">Kategori</th>
                <th className="p-4 font-semibold">Pertanyaan</th>
                <th className="p-4 font-semibold w-[140px] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-500">Memuat data bank soal...</td>
                </tr>
              ) : displayedQuestions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-12 text-center">
                    <div className="text-slate-500 mb-4">Belum ada soal dalam sistem.</div>
                    <button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2 font-semibold text-accent border-2 border-accent rounded-xl hover:bg-accent hover:text-white transition-colors">Mulai Import Data</button>
                  </td>
                </tr>
              ) : (
                displayedQuestions.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4 align-top">
                      <span className={`inline-block px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-md ${getCategoryColor(q.category)}`}>
                        {q.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-ink dark:text-slate-200 line-clamp-2 mb-1 flex items-center gap-2">
                        {isNewQuestion(q.created_at) && (
                          <span className="inline-block px-1.5 py-0.5 text-[0.6rem] font-bold text-white bg-danger rounded shrink-0">
                            BARU
                          </span>
                        )}
                        <span>{q.question}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1.5">
                        <span className="font-semibold">Kunci:</span> {q.options[q.correct_index]}
                      </div>
                    </td>
                    <td className="p-4 text-right align-top">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModalForEdit(q)} className="text-slate-400 hover:text-accent font-semibold p-2 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Edit Soal">
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="text-slate-400 hover:text-danger font-semibold p-2 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Hapus Soal">
                          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Menampilkan <span className="font-semibold text-ink dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-ink dark:text-slate-200">{Math.min(currentPage * itemsPerPage, sortedQuestions.length)}</span> dari <span className="font-semibold text-ink dark:text-slate-200">{sortedQuestions.length}</span> soal
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="text-sm font-semibold px-2 text-ink dark:text-slate-200">
                Hal {currentPage} / {totalPages}
              </span>
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold mb-2 text-ink dark:text-slate-100">Import Data Soal</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Tambahkan puluhan hingga ratusan soal sekaligus menggunakan file CSV atau JSON.</p>
            
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="file" 
                  accept=".csv,.json" 
                  ref={fileInputRef} 
                  onChange={handleImportFile} 
                  className="hidden" 
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mb-3">
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-accent"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="font-semibold text-ink dark:text-slate-200 text-sm">Klik untuk Unggah File</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mendukung format .CSV dan .JSON</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={handleDownloadTemplateCSV} className="text-xs font-semibold py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Template CSV
                </button>
                <button onClick={handleDownloadTemplateJSON} className="text-xs font-semibold py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Template JSON
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button onClick={() => setIsImportModalOpen(false)} className="px-5 py-2.5 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-bold mb-6 text-ink dark:text-slate-100">{editingId ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Kategori Soal</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 transition-shadow outline-none"
                >
                  <option value="numerik">Numerik</option>
                  <option value="logika">Logika & Penalaran</option>
                  <option value="verbal">Verbal</option>
                  <option value="situasional">Situasional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Teks Pertanyaan</label>
                <textarea 
                  value={formData.question} 
                  onChange={e => setFormData({...formData, question: e.target.value})}
                  rows={3}
                  required
                  placeholder="Masukkan pertanyaan di sini..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 transition-shadow outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Opsi A</label>
                  <input type="text" required value={formData.option_a} onChange={e => setFormData({...formData, option_a: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Opsi B</label>
                  <input type="text" required value={formData.option_b} onChange={e => setFormData({...formData, option_b: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Opsi C</label>
                  <input type="text" required value={formData.option_c} onChange={e => setFormData({...formData, option_c: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Opsi D</label>
                  <input type="text" required value={formData.option_d} onChange={e => setFormData({...formData, option_d: e.target.value})} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Jawaban Benar</label>
                <div className="flex gap-3">
                  {[0, 1, 2, 3].map(idx => (
                    <label key={idx} className={`flex-1 flex items-center justify-center py-3 rounded-xl border-2 cursor-pointer transition-colors ${formData.correct_index === idx ? 'border-success bg-success/10 text-success font-bold' : 'border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                      <input type="radio" name="correct_index" value={idx} checked={formData.correct_index === idx} onChange={() => setFormData({...formData, correct_index: idx})} className="hidden" />
                      {['A', 'B', 'C', 'D'][idx]}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink dark:text-slate-200 mb-2">Pembahasan / Penjelasan</label>
                <textarea 
                  value={formData.explanation} 
                  onChange={e => setFormData({...formData, explanation: e.target.value})}
                  rows={2}
                  required
                  placeholder="Jelaskan mengapa jawaban tersebut benar..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-canvas dark:bg-slate-800 text-ink dark:text-slate-200 focus:ring-2 focus:ring-ink dark:focus:ring-slate-400 transition-shadow outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-6 py-3 font-semibold bg-ink dark:bg-slate-200 text-white dark:text-[#090e17] rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors">
                  {editingId ? 'Simpan Perubahan' : 'Simpan Soal Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
