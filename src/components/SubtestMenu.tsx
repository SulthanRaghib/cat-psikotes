"use client";

import { Subtest } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubtestMenu({ category = 'PSIKOTES' }: { category?: 'PSIKOTES' | 'TPA' }) {
  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/subtests?category=${category}`)
      .then(res => res.json())
      .then(data => {
        if (data.subtests) setSubtests(data.subtests);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Memuat modul tes...</div>;
  }

  // Group subtests by group_name
  const grouped = subtests.reduce((acc, curr) => {
    if (!acc[curr.group_name]) acc[curr.group_name] = [];
    acc[curr.group_name].push(curr);
    return acc;
  }, {} as Record<string, Subtest[]>);

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto p-4">
      {Object.entries(grouped).map(([groupName, tests]) => (
        <div key={groupName} className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-[#0F2A43] dark:text-slate-100 border-b pb-2">{groupName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map(test => (
              <div key={test.id} className={`p-4 rounded-lg border ${test.is_active === 1 ? 'border-[#E8821E] hover:shadow-md transition-shadow' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-lg">{test.number}. {test.name}</div>
                  {test.is_active === 1 ? (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Aktif</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-500">Segera Hadir</span>
                  )}
                </div>
                {test.is_active === 1 ? (
                  <Link href={category === 'TPA' ? `/tpa/${test.id}` : `/subtes/${test.id}`} className="mt-4 inline-block w-full text-center bg-[#0F2A43] hover:bg-[#E8821E] text-white font-semibold py-2 rounded transition-colors">
                    Mulai
                  </Link>
                ) : (
                  <button disabled className="mt-4 w-full bg-slate-200 dark:bg-slate-700 text-slate-400 font-semibold py-2 rounded cursor-not-allowed">
                    Belum Tersedia
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
