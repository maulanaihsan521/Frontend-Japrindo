'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  CalendarDays,
  CloudDownload,
  CloudUpload,
  FileSpreadsheet,
  Upload,
  ShieldCheck,
  Check,
  Clock,
  SearchCheck,
  UserCheck,
  BarChart3,
  FileCheck2,
  Database,
  Loader2,
} from 'lucide-react'
import {
  DASH,
  CEK_OTOMATIS,
  IMPORT_FILE,
} from '@/lib/jamkrindo-data'
import { ScreenCard, ScreenTitle, PrimaryAction } from './shared'
import { cn } from '@/lib/utils'

// ============================================================
// LAYAR 2 — Tentukan Periode Data
// ============================================================
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function bulanOptions(tahun: number) {
  return BULAN.map((b) => `${b} ${tahun}`)
}

function cariRentang(bulanSebelum: string): string {
  // "September 2025" -> "01/09/2025 - 30/09/2025"
  const [nama, th] = bulanSebelum.split(' ')
  const idx = BULAN.indexOf(nama)
  const last = new Date(Number(th), idx + 1, 0).getDate()
  const mm = String(idx + 1).padStart(2, '0')
  return `01/${mm}/${th} - ${String(last).padStart(2, '0')}/${mm}/${th}`
}

export function PeriodeScreen({
  bulanDiperiksa,
  bulanSebelum,
  onChangeBulan,
  onChangeSebelum,
  onLanjut,
  onBack,
}: {
  bulanDiperiksa: string
  bulanSebelum: string
  onChangeBulan: (v: string) => void
  onChangeSebelum: (v: string) => void
  onLanjut: () => void
  onBack: () => void
}) {
  return (
    <ScreenCard>
      <ScreenTitle
        icon={CalendarDays}
        title="Tentukan Periode Data"
        description="Pilih periode data yang akan diperiksa. Contoh: Jika ingin memeriksa data Oktober, maka pilih data bulan September."
        backLabel="Kembali ke Dashboard"
        onBack={onBack}
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="bulan-diperiksa" className="mb-2 block text-[14.5px] font-bold text-[#0e2a4d]">
            Bulan yang diperiksa
          </label>
          <select
            id="bulan-diperiksa"
            value={bulanDiperiksa}
            onChange={(e) => {
              const v = e.target.value
              onChangeBulan(v)
              // geser otomatis bulan sebelumnya
              const [nama, th] = v.split(' ')
              const idx = BULAN.indexOf(nama)
              const prevIdx = idx - 1
              const prevTh = prevIdx < 0 ? Number(th) - 1 : Number(th)
              const prevNama = BULAN[(prevIdx + 12) % 12]
              onChangeSebelum(`${prevNama} ${prevTh}`)
            }}
            className="h-11 w-full rounded-xl border border-blue-100 bg-white px-4 text-[14.5px] font-semibold text-[#0e2a4d] outline-none ring-[#1e6bf2]/30 transition focus:ring-2"
          >
            {[2024, 2025, 2026].map((t) =>
              bulanOptions(t).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="bulan-sebelum" className="mb-2 block text-[14.5px] font-bold text-[#0e2a4d]">
            Periode data (bulan sebelumnya)
          </label>
          <select
            id="bulan-sebelum"
            value={bulanSebelum}
            onChange={(e) => onChangeSebelum(e.target.value)}
            className="h-11 w-full rounded-xl border border-blue-100 bg-white px-4 text-[14.5px] font-semibold text-[#0e2a4d] outline-none ring-[#1e6bf2]/30 transition focus:ring-2"
          >
            {[2024, 2025, 2026].map((t) =>
              bulanOptions(t).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex h-11 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/40 px-4">
          <CalendarDays className="h-5 w-5 shrink-0 text-[#1e6bf2]" aria-hidden />
          <span className="text-[14.5px] font-bold text-[#0e2a4d]">{cariRentang(bulanSebelum)}</span>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryAction onClick={onLanjut}>Lanjutkan</PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 3 — Ambil Data dari Portal Jamkrindo
// ============================================================
export function PortalScreen({
  onDownload,
  onBack,
}: {
  onDownload: () => Promise<void> | void
  onBack: () => void
}) {
  const [downloading, setDownloading] = useState(false)

  const handle = async () => {
    setDownloading(true)
    await onDownload()
    setDownloading(false)
  }

  return (
    <ScreenCard>
      <ScreenTitle
        icon={CloudDownload}
        title="Ambil Data dari Portal Jamkrindo"
        description="Silakan login ke portal Jamkrindo untuk mengambil data DWH realisasi kredit bank mitra."
        backLabel="Kembali ke Periode"
        onBack={onBack}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4">
          <span className="text-[14.5px] font-bold text-[#0e2a4d]">Portal Jamkrindo</span>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-2 rounded-lg bg-[#e6effd] px-4 py-2 text-[14px] font-extrabold text-[#1e6bf2] underline decoration-[#1e6bf2]/40 underline-offset-2 transition hover:bg-[#d7e5fb]"
          >
            <CloudDownload className="h-4 w-4" aria-hidden />
            Login ke Portal
          </a>
        </div>

        <div>
          <label htmlFor="jenis-data" className="mb-2 block text-[14.5px] font-bold text-[#0e2a4d]">
            Jenis Data
          </label>
          <select
            id="jenis-data"
            defaultValue="Realisasi Kredit"
            className="h-11 w-full rounded-xl border border-blue-100 bg-white px-4 text-[14.5px] font-semibold text-[#0e2a4d] outline-none ring-[#1e6bf2]/30 transition focus:ring-2"
          >
            <option>Realisasi Kredit</option>
            <option>Data Debitur</option>
            <option>Data Penjaminan</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[14.5px] font-bold text-[#0e2a4d]">Periode</label>
          <div className="flex h-11 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/40 px-4">
            <CalendarDays className="h-5 w-5 shrink-0 text-[#1e6bf2]" aria-hidden />
            <span className="text-[14.5px] font-bold text-[#0e2a4d]">{DASH.rentangPeriode}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PrimaryAction onClick={handle} loading={downloading}>
          {downloading ? 'Mengunduh Data...' : 'Download Data'}
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 4 — Import Data
// ============================================================
export function ImportScreen({
  fileUploaded,
  onUpload,
  onProses,
  onBack,
}: {
  fileUploaded: boolean
  onUpload: () => void
  onProses: () => Promise<void> | void
  onBack: () => void
}) {
  const [proses, setProses] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  const handle = async () => {
    setProses(true)
    await onProses()
    setProses(false)
  }

  return (
    <ScreenCard>
      <ScreenTitle
        icon={Upload}
        title="Import Data"
        description="Unggah file data yang telah diunduh dari Portal Jamkrindo."
        backLabel="Kembali ke Portal"
        onBack={onBack}
      />

      <div
        ref={dragRef}
        onClick={() => !fileUploaded && onUpload()}
        onKeyDown={(e) => {
          if (!fileUploaded && (e.key === 'Enter' || e.key === ' ')) onUpload()
        }}
        role="button"
        tabIndex={0}
        aria-label="Area unggah file"
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-10 text-center transition',
          !fileUploaded && 'hover:border-[#1e6bf2] hover:bg-blue-50'
        )}
      >
        <CloudUpload className="h-12 w-12 text-[#1e6bf2]" aria-hidden />
        <p className="text-[15px] font-bold text-[#0e2a4d]">Drag &amp; drop file di sini</p>
        <p className="text-[13.5px] text-slate-400">atau</p>
        <span className="mt-1 flex h-10 items-center rounded-lg bg-[#1e6bf2] px-5 text-[14px] font-extrabold text-white shadow-sm">
          Pilih File
        </span>
        <p className="mt-2.5 text-[13px] text-slate-400">
          Format file: .csv, .xlsx | Maks. 10 MB
        </p>
      </div>

      {fileUploaded && (
        <div className="mt-6 jk-fade-up">
          <p className="mb-2.5 text-[14.5px] font-bold text-[#0e2a4d]">File yang diunggah</p>
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-5 py-3.5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50" aria-hidden>
              <FileSpreadsheet className="h-5.5 w-5.5 text-emerald-600" />
            </span>
            <div className="flex-1">
              <p className="text-[14.5px] font-bold text-[#0e2a4d]">{IMPORT_FILE.nama}</p>
              <p className="text-[13px] text-slate-400">{IMPORT_FILE.ukuran}</p>
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500" aria-hidden>
              <Check className="h-4.5 w-4.5 text-white" />
            </span>
          </div>
        </div>
      )}

      <div className="mt-6">
        <PrimaryAction onClick={handle} disabled={!fileUploaded} loading={proses}>
          {proses ? 'Memproses...' : 'Proses Data'}
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 5 — Validasi Data
// ============================================================
const HASIL_VALIDASI = [
  'Format file sesuai',
  'Semua kolom wajib terisi',
  'Data siap diproses',
]

export function ValidasiScreen({ onLanjut, onBack }: { onLanjut: () => void; onBack: () => void }) {
  const [progress, setProgress] = useState(0)
  const [items, setItems] = useState(0)
  const done = progress >= 100

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t)
          return 100
        }
        return Math.min(p + 4, 100)
      })
    }, 60)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (done && items < HASIL_VALIDASI.length) {
      const t = setTimeout(() => setItems((i) => i + 1), 280)
      return () => clearTimeout(t)
    }
  }, [done, items])

  return (
    <ScreenCard>
      <ScreenTitle
        icon={ShieldCheck}
        title="Validasi Data"
        description="Sistem sedang memeriksa format dan kelengkapan data."
        iconClass="bg-emerald-50 text-emerald-500"
        backLabel="Kembali ke Import"
        onBack={onBack}
      />

      <div>
        <div className="flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-blue-50" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-[#1e6bf2] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-14 text-right text-[14.5px] font-extrabold text-[#0e2a4d]">
            {progress}%
          </span>
        </div>
      </div>

      {done && (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 jk-fade-up">
          <p className="text-[15.5px] font-extrabold text-[#0e2a4d]">Hasil Validasi</p>
          <ul className="mt-3.5 space-y-3">
            {HASIL_VALIDASI.slice(0, items).map((h) => (
              <li key={h} className="flex items-center gap-3 jk-fade-up">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500" aria-hidden>
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="text-[14.5px] font-semibold text-slate-700">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <PrimaryAction onClick={onLanjut} disabled={!done}>
          Lanjutkan ke Pengecekan Anomali
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 6 — Pengecekan Anomali (5 aturan, berurutan)
// ============================================================
const CEK_ICONS: Record<string, React.ElementType> = {
  id: SearchCheck,
  user: UserCheck,
  chart: BarChart3,
  doc: FileCheck2,
  data: Database,
}

export function PengecekanScreen({ onSelesai, onBack }: { onSelesai: () => void; onBack: () => void }) {
  const [doneCount, setDoneCount] = useState(0)
  const allDone = doneCount >= CEK_OTOMATIS.length

  useEffect(() => {
    if (doneCount >= CEK_OTOMATIS.length) {
      const t = setTimeout(onSelesai, 900)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setDoneCount((c) => c + 1), 850)
    return () => clearTimeout(t)
  }, [doneCount, onSelesai])

  return (
    <ScreenCard>
      <ScreenTitle
        icon={SearchCheck}
        title="Pengecekan Anomali"
        description="Sistem melakukan pengecekan anomali secara otomatis berdasarkan aturan yang telah ditentukan."
        backLabel="Kembali ke Validasi"
        onBack={onBack}
      />

      <ul className="divide-y divide-blue-50 rounded-2xl border border-blue-100">
        {CEK_OTOMATIS.map((c, i) => {
          const Icon = CEK_ICONS[c.icon]
          const selesai = i < doneCount
          const aktif = i === doneCount
          return (
            <li
              key={c.label}
              className={cn(
                'flex items-center gap-4 px-5 py-4 transition-opacity',
                !selesai && !aktif && 'opacity-60'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all',
                  selesai
                    ? 'bg-emerald-500'
                    : aktif
                      ? 'bg-[#1e6bf2] ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-400'
                )}
                aria-hidden
              >
                {selesai ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </span>
              <span className="flex-1 text-[15px] font-bold text-[#0e2a4d]">{c.label}</span>
              {selesai ? (
                <span className="flex items-center gap-1.5 text-[14px] font-extrabold text-emerald-600 jk-fade-up">
                  <Check className="h-4 w-4" aria-hidden /> Selesai
                </span>
              ) : aktif ? (
                <span className="flex items-center gap-1.5 text-[14px] font-bold text-[#1e6bf2] jk-pulse-text">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sedang diproses...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[14px] font-semibold text-slate-400">
                  <Clock className="h-4 w-4" aria-hidden /> Menunggu
                </span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="mt-6">
        <PrimaryAction onClick={onSelesai} disabled={!allDone}>
          Lihat Hasil Pengecekan
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}
