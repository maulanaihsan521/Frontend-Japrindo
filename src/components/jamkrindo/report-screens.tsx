'use client'

import React, { useState } from 'react'
import {
  CalendarDays,
  FileBarChart2,
  Database,
  AlertOctagon,
  BadgeCheck,
  CheckCircle2,
  Check,
  FileDown,
  FileText,
  Home,
  Landmark,
  Filter,
} from 'lucide-react'
import {
  DASH,
  ANOMALI_PER_JENIS,
  formatRibuan,
} from '@/lib/jamkrindo-data'
import { ScreenCard, ScreenTitle, PrimaryAction, JamkrindoLogo } from './shared'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

// ============================================================
// LAYAR 12 — Laporan Hasil Pengecekan
// ============================================================
export function LaporanScreen({ onUnduh }: { onUnduh: () => void }) {
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(true)
  const maxVal = Math.max(...ANOMALI_PER_JENIS.map((d) => d.value))

  const handleGenerate = () => {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 1200)
  }

  return (
    <ScreenCard>
      <ScreenTitle
        icon={FileBarChart2}
        title="Laporan Hasil Pengecekan"
        description="Menghasilkan rekap anomali untuk pelaporan ke unit pusat."
      />

      {/* Filter */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lap-periode" className="text-[13.5px] font-bold text-slate-500">
            Periode
          </Label>
          <div className="mt-2 flex h-11 items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/40 px-4 text-[14.5px] font-bold text-[#0e2a4d]">
            {DASH.sumberPeriode}
            <CalendarDays className="ml-auto h-5 w-5 text-[#1e6bf2]" aria-hidden />
          </div>
        </div>
        <div>
          <Label htmlFor="lap-bank" className="text-[13.5px] font-bold text-slate-500">
            Bank Mitra
          </Label>
          <Select defaultValue="semua">
            <SelectTrigger id="lap-bank" className="mt-2 h-11 w-full rounded-xl border-blue-100 text-[14.5px] font-semibold text-[#0e2a4d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="semua">Semua Bank</SelectItem>
              <SelectItem value="mandiri">Bank Mandiri</SelectItem>
              <SelectItem value="bni">Bank BNI</SelectItem>
              <SelectItem value="bri">Bank BRI</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lap-nama" className="text-[13.5px] font-bold text-slate-500">
            Nama Data
          </Label>
          <Select defaultValue="realisasi">
            <SelectTrigger id="lap-nama" className="mt-2 h-11 w-full rounded-xl border-blue-100 text-[14.5px] font-semibold text-[#0e2a4d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="realisasi">Realisasi Kredit</SelectItem>
              <SelectItem value="debitur">Data Debitur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="lap-jenis" className="text-[13.5px] font-bold text-slate-500">
            Jenis Anomali
          </Label>
          <Select defaultValue="semua">
            <SelectTrigger id="lap-jenis" className="mt-2 h-11 w-full rounded-xl border-blue-100 text-[14.5px] font-semibold text-[#0e2a4d]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="semua">Semua</SelectItem>
              <SelectItem value="ktp">KTP / NPWB</SelectItem>
              <SelectItem value="usia">Usia &amp; Tanggal Lahir</SelectItem>
              <SelectItem value="skema">Skema Kredit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5">
        <PrimaryAction onClick={handleGenerate} loading={generating}>
          <Filter className="h-4 w-4" aria-hidden />
          {generating ? 'Menyusun Laporan...' : 'Generate Laporan'}
        </PrimaryAction>
      </div>

      {/* Preview laporan */}
      {generated && (
        <div className="jk-fade-up mt-6 rounded-2xl border-2 border-blue-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-50 px-6 py-4">
            <JamkrindoLogo />
            <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-[12.5px] font-extrabold text-[#1e6bf2]">
              Pratinjau Laporan
            </span>
          </div>
          <div className="px-6 py-6">
            <h3 className="text-center text-[17.5px] font-extrabold leading-snug text-[#0e2a4d]">
              Laporan Data Anomaly
              <br />
              Realisasi Kredit Bank Mitra
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <MiniStat
                icon={Database}
                label="Total Data"
                value={formatRibuan(DASH.totalData)}
                iconBg="#e6effd"
                iconColor="#1e6bf2"
              />
              <MiniStat
                icon={AlertOctagon}
                label="Data Anomali"
                value={String(DASH.dataAnomali)}
                iconBg="#fdeaea"
                iconColor="#e04b3a"
                valueColor="text-red-600"
              />
              <MiniStat
                icon={BadgeCheck}
                label="Selesai"
                value={String(DASH.selesaiDitangani)}
                iconBg="#e3f7ea"
                iconColor="#2bb673"
              />
            </div>

            <p className="mt-6 text-[15.5px] font-extrabold text-[#0e2a4d]">
              Rekap Anomali per Jenis
            </p>
            <div className="mt-4 space-y-3.5">
              {ANOMALI_PER_JENIS.map((d) => (
                <div key={d.label} className="flex items-center gap-3.5">
                  <span className="w-36 shrink-0 text-right text-[14px] font-semibold text-slate-500 sm:w-44">
                    {d.label}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-blue-50">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(d.value / maxVal) * 100}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                  <span className="w-11 text-[14px] font-extrabold text-[#0e2a4d]">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <PrimaryAction onClick={onUnduh} outline>
          <FileDown className="h-4.5 w-4.5" aria-hidden />
          Unduh Laporan (CSV)
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  valueColor = 'text-[#0e2a4d]',
}: {
  icon: React.ElementType
  label: string
  value: string
  iconBg: string
  iconColor: string
  valueColor?: string
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-blue-100 px-4 py-3.5">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: iconBg }}
        aria-hidden
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </span>
      <div>
        <p className="text-[13px] font-semibold text-slate-400">{label}</p>
        <p className={cn('text-[18.5px] font-extrabold leading-tight', valueColor)}>{value}</p>
      </div>
    </div>
  )
}

// ============================================================
// LAYAR 13 — Selesai
// ============================================================
export function SelesaiScreen({
  onKembali,
  onUnduh,
}: {
  onKembali: () => void
  onUnduh: () => void
}) {
  return (
    <ScreenCard className="max-w-3xl text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 jk-fade-up" aria-hidden>
        <CheckCircle2 className="h-12 w-12 text-white" />
      </div>

      <h2 className="mt-7 text-[22px] font-extrabold leading-snug text-[#0e2a4d]">
        Proses Pengecekan Anomali Data
        <br />
        Telah Selesai
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-slate-500">
        Data telah diperiksa, diverifikasi, dan tindak lanjut sudah dicatat dalam sistem.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={onKembali}
          className="flex h-12 items-center justify-center gap-2.5 rounded-xl border-2 border-[#1e6bf2] bg-white text-[15px] font-extrabold text-[#1e6bf2] transition hover:bg-blue-50"
        >
          <Home className="h-5 w-5" aria-hidden />
          Kembali ke Dashboard
        </button>
        <PrimaryAction onClick={onUnduh}>
          <FileDown className="h-4.5 w-4.5" aria-hidden />
          Unduh Laporan
        </PrimaryAction>
      </div>

      {/* Ilustrasi dokumen */}
      <div className="relative mx-auto mt-8 h-40 w-56" aria-hidden>
        <div className="absolute bottom-2 left-8 h-36 w-26 rounded-lg bg-blue-100/80" />
        <div className="absolute bottom-0 left-1/2 h-40 w-30 -translate-x-1/2 rounded-lg border border-blue-100 bg-white p-3.5 shadow-md">
          <div className="h-3 w-18 rounded-full bg-[#1e6bf2]/70" />
          <div className="mt-3 h-1.5 w-full rounded-full bg-blue-100" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-blue-100" />
          <div className="mt-2 h-1.5 w-3/4 rounded-full bg-blue-100" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-blue-100" />
          <div className="mt-2 h-1.5 w-1/2 rounded-full bg-blue-100" />
        </div>
        <div className="absolute -right-1 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#1e6bf2] shadow-lg shadow-blue-500/40">
          <Check className="h-6.5 w-6.5 text-white" />
        </div>
        <div className="absolute bottom-0 left-0 h-7 w-7 rounded-full bg-blue-200/70" />
        <div className="absolute bottom-16 right-6 h-3.5 w-3.5 rounded-full bg-blue-200/70" />
      </div>
    </ScreenCard>
  )
}

// ============================================================
// PENGATURAN (menu sidebar)
// ============================================================
export function PengaturanScreen() {
  const [notif, setNotif] = useState(true)
  const [laporan, setLaporan] = useState(true)
  const [auto, setAuto] = useState(false)

  return (
    <ScreenCard className="max-w-3xl">
      <ScreenTitle
        icon={Landmark}
        title="Pengaturan"
        description="Atur preferensi notifikasi dan pemrosesan data."
      />
      <div className="divide-y divide-blue-50 rounded-2xl border border-blue-100 px-6">
        <SettingRow
          title="Notifikasi Anomali"
          desc="Kirim pemberitahuan saat anomali baru ditemukan."
          checked={notif}
          onChange={setNotif}
        />
        <SettingRow
          title="Notifikasi Laporan"
          desc="Kirim ringkasan laporan harian ke email."
          checked={laporan}
          onChange={setLaporan}
        />
        <SettingRow
          title="Pengecekan Otomatis"
          desc="Jalankan pengecekan anomali setiap data diimpor."
          checked={auto}
          onChange={setAuto}
        />
      </div>
    </ScreenCard>
  )
}

function SettingRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50" aria-hidden>
          <FileText className="h-5 w-5 text-[#1e6bf2]" />
        </span>
        <div>
          <p className="text-[15px] font-extrabold text-[#0e2a4d]">{title}</p>
          <p className="mt-1 text-[13.5px] text-slate-500">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  )
}
