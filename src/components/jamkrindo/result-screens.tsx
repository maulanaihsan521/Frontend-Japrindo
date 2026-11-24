'use client'

import React, { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FileWarning,
  Search,
  SearchX,
} from 'lucide-react'
import { ANOMALI_ROWS, formatTanggalID, type AnomaliRow } from '@/lib/jamkrindo-data'
import { ScreenCard, ScreenTitle, StatusBadge, RedBadge, PrimaryAction } from './shared'
import { cn } from '@/lib/utils'

// ============================================================
// LAYAR 7 — Hasil Pengecekan Anomali
// ============================================================
const TABS = [
  { key: 'semua', label: 'Semua', count: ANOMALI_ROWS.length },
  { key: 'ktp', label: 'KTP/NPWB', count: ANOMALI_ROWS.filter((r) => r.kelompok === 'ktp').length },
  { key: 'usia', label: 'Usia', count: ANOMALI_ROWS.filter((r) => r.kelompok === 'usia').length },
  { key: 'skema', label: 'Skema', count: ANOMALI_ROWS.filter((r) => r.kelompok === 'skema').length },
] as const

type TabKey = (typeof TABS)[number]['key']
const PER_PAGE = 5

export function HasilScreen({ onOpenDetail }: { onOpenDetail: (row: AnomaliRow) => void }) {
  const [tab, setTab] = useState<TabKey>('semua')
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const base = tab === 'semua' ? ANOMALI_ROWS : ANOMALI_ROWS.filter((r) => r.kelompok === tab)
    const s = q.trim().toLowerCase()
    if (!s) return base
    return base.filter(
      (r) =>
        r.noDebitur.toLowerCase().includes(s) ||
        r.nama.toLowerCase().includes(s) ||
        r.jenis.toLowerCase().includes(s) ||
        r.nilaiBermasalah.toLowerCase().includes(s)
    )
  }, [tab, q])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // jendela geser: maks 5 nomor halaman yang selalu memuat halaman aktif
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4))
  const windowEnd = Math.min(totalPages, windowStart + 4)
  const pageButtons = useMemo(() => {
    const nums: number[] = []
    for (let i = windowStart; i <= windowEnd; i++) nums.push(i)
    return nums
  }, [windowStart, windowEnd])

  return (
    <ScreenCard className="max-w-6xl">
      <ScreenTitle
        icon={FileWarning}
        title="Hasil Pengecekan Anomali"
        description="Menampilkan daftar anomali yang ditemukan lengkap dengan jenis dan statusnya. Klik baris untuk melihat detail."
      />

      {/* Tabs + pencarian */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="nice-scroll flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter jenis anomali">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => {
                setTab(t.key)
                setPage(1)
              }}
              className={cn(
                'h-10 shrink-0 rounded-lg px-4 text-[14px] font-extrabold transition-all',
                tab === t.key
                  ? 'bg-[#1e6bf2] text-white shadow-md shadow-blue-500/25'
                  : 'border border-blue-100 bg-white text-slate-500 hover:bg-blue-50'
              )}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
        <div className="relative w-full shrink-0 sm:w-72">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            placeholder="Cari debitur / jenis anomali..."
            aria-label="Cari data anomali"
            className="h-10 w-full rounded-xl border border-blue-100 bg-white pl-10 pr-4 text-[14px] font-semibold text-[#0e2a4d] outline-none ring-[#1e6bf2]/30 transition placeholder:font-medium placeholder:text-slate-400 focus:ring-2"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="nice-scroll mt-4 overflow-x-auto rounded-2xl border border-blue-100">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-blue-50/60">
              <th className="w-16 px-4 py-3 text-[13px] font-extrabold text-slate-500">No</th>
              <th className="px-4 py-3 text-[13px] font-extrabold text-slate-500">No. Debitur</th>
              <th className="px-4 py-3 text-[13px] font-extrabold text-slate-500">Jenis Anomali</th>
              <th className="px-4 py-3 text-[13px] font-extrabold text-slate-500">Nilai Bermasalah</th>
              <th className="px-4 py-3 text-[13px] font-extrabold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <SearchX className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
                  <p className="mt-3 text-[15px] font-bold text-slate-500">
                    Tidak ada data yang cocok
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-slate-400">
                    Coba ubah kata kunci pencarian atau pilih jenis anomali lain.
                  </p>
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr
                key={r.id}
                onClick={() => onOpenDetail(r)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onOpenDetail(r)
                }}
                tabIndex={0}
                aria-label={`Lihat detail anomali debitur ${r.noDebitur}`}
                className="cursor-pointer border-t border-blue-50 transition-colors hover:bg-blue-50/60 focus:bg-blue-50 focus:outline-none"
              >
                <td className="px-4 py-3 text-[14px] font-semibold text-slate-400">
                  {(page - 1) * PER_PAGE + i + 1}
                </td>
                <td className="px-4 py-3 text-[14px] font-bold text-[#0e2a4d]">{r.noDebitur}</td>
                <td className="px-4 py-3 text-[14px] font-semibold text-slate-600">{r.jenis}</td>
                <td className="px-4 py-3 text-[14px] font-semibold text-slate-600">
                  {r.nilaiBermasalah}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Halaman sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 text-slate-500 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bf2]/40 disabled:opacity-40"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          {windowStart > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                aria-label="Halaman 1"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 text-[13.5px] font-extrabold text-slate-500 transition hover:bg-blue-50"
              >
                1
              </button>
              {windowStart > 2 && (
                <span className="flex h-9 w-6 items-center justify-center text-slate-400" aria-hidden>
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )}
            </>
          )}
          {pageButtons.map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              aria-current={page === n ? 'page' : undefined}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-[13.5px] font-extrabold transition',
                page === n
                  ? 'bg-[#1e6bf2] text-white shadow-sm'
                  : 'border border-blue-100 text-slate-500 hover:bg-blue-50'
              )}
            >
              {n}
            </button>
          ))}
          {windowEnd < totalPages && (
            <>
              {windowEnd < totalPages - 1 && (
                <span className="flex h-9 w-6 items-center justify-center text-slate-400" aria-hidden>
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )}
              <button
                onClick={() => setPage(totalPages)}
                aria-label={`Halaman ${totalPages}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 text-[13.5px] font-extrabold text-slate-500 transition hover:bg-blue-50"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Halaman berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 text-slate-500 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bf2]/40 disabled:opacity-40"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
        <p className="text-[13.5px] font-semibold text-slate-400">
          Halaman {page} dari {totalPages} · Total {filtered.length} data
        </p>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 8 — Detail Anomali
// ============================================================
export function DetailScreen({
  row,
  onKembali,
  onVerifikasi,
  onLihatEvidence,
}: {
  row: AnomaliRow
  onKembali: () => void
  onVerifikasi: () => void
  onLihatEvidence: () => void
}) {
  return (
    <ScreenCard>
      <ScreenTitle
        icon={FileWarning}
        title="Detail Anomali"
        iconClass="bg-blue-50 text-[#1e6bf2]"
        backLabel="Kembali ke Hasil Pengecekan"
        onBack={onKembali}
      />

      <div className="rounded-2xl border border-blue-100 p-5">
        <p className="text-[16px] font-extrabold text-[#0e2a4d]">Informasi Debitur</p>
        <div className="mt-1.5 divide-y divide-blue-50">
          <KVRowSimple label="No. Debitur" value={row.noDebitur} />
          <KVRowSimple label="Nama" value={row.nama} />
          <KVRowSimple label="No. KTP" value={row.noKtp} mono />
          <KVRowSimple label="Tanggal Lahir" value={formatTanggalID(row.tanggalLahir)} />
          <KVRowSimple label="Usia" value={row.usia} strong />
        </div>

        <div className="mt-3.5 space-y-3 border-t border-blue-50 pt-3.5">
          <p className="text-[13px] font-extrabold uppercase tracking-wide text-slate-400">
            Detail Anomali
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[14.5px] font-semibold text-slate-500 sm:w-[200px]">
              Jenis Anomali
            </span>
            <RedBadge text={row.jenisLengkap} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[14.5px] font-semibold text-slate-500 sm:w-[200px]">
              Nilai Bermasalah
            </span>
            <span className="text-[14.5px] font-bold text-red-600">{row.nilaiBermasalah}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[14.5px] font-semibold text-slate-500 sm:w-[200px]">
              Rekomendasi
            </span>
            <span className="text-[14.5px] font-bold text-[#0e2a4d]">{row.rekomendasi}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[14.5px] font-semibold text-slate-500 sm:w-[200px]">
              Status
            </span>
            <StatusBadge status={row.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={onLihatEvidence}
          className="flex h-12 items-center justify-center rounded-xl border-2 border-[#1e6bf2] bg-white text-[15px] font-extrabold text-[#1e6bf2] transition hover:bg-blue-50"
        >
          Lihat Evidence
        </button>
        <PrimaryAction onClick={onVerifikasi}>Verifikasi</PrimaryAction>
      </div>
    </ScreenCard>
  )
}

function KVRowSimple({
  label,
  value,
  mono,
  strong,
}: {
  label: string
  value: string
  mono?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
      <span className="text-[14.5px] font-semibold text-slate-500 sm:w-[200px]">{label}</span>
      <span
        className={cn(
          'text-[14.5px] font-bold text-[#0e2a4d]',
          mono && 'font-mono text-[14px] tracking-wide',
          strong && 'text-[15.5px]'
        )}
      >
        {value}
      </span>
    </div>
  )
}
