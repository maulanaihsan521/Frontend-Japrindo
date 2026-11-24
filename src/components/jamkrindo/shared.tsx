'use client'

import React from 'react'
import Image from 'next/image'
import {
  Home,
  AlertOctagon,
  CloudUpload,
  FileText,
  Settings,
  Menu,
  ShieldCheck,
  ChevronLeft,
  Plus,
  Clock,
  Search,
  Wrench,
  ArrowUpRight,
  Check,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StatusAnomali } from '@/lib/jamkrindo-data'

// ============================================================
// Logo Jamkrindo (gambar logo asli + teks)
// ============================================================
export function JamkrindoLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {dark ? (
        // Di atas latar navy: logo ditaruh di chip putih agar kontras
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
          aria-hidden
        >
          <Image
            src="/jamkrindo-logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </span>
      ) : (
        <Image
          src="/jamkrindo-logo.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-xl shadow-sm"
        />
      )}
      <span
        className={cn(
          'text-[19px] font-extrabold tracking-tight',
          dark ? 'text-white' : 'text-[#0e2a4d]'
        )}
      >
        Jamkrindo
      </span>
    </div>
  )
}

// ============================================================
// Sidebar navy
// ============================================================
export type MenuKey = 'dashboard' | 'anomali' | 'upload' | 'laporan' | 'pengaturan'

const MENU: { key: MenuKey; label: string; icon: React.ElementType; step: number | 'pengaturan' }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, step: 1 },
  { key: 'anomali', label: 'Data Anomali', icon: AlertOctagon, step: 7 },
  { key: 'upload', label: 'Upload Data', icon: CloudUpload, step: 4 },
  { key: 'laporan', label: 'Laporan', icon: FileText, step: 12 },
  { key: 'pengaturan', label: 'Pengaturan', icon: Settings, step: 'pengaturan' },
]

export function SidebarContent({
  active,
  onNavigate,
}: {
  active: MenuKey
  onNavigate: (step: number | 'pengaturan') => void
}) {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0f2f57] via-[#0d2949] to-[#0a1f3c] text-white">
      <div className="px-5 pb-7 pt-7">
        <JamkrindoLogo dark />
      </div>
      <nav
        className="nice-scroll flex-1 space-y-2 overflow-y-auto px-3.5"
        aria-label="Menu utama"
      >
        {MENU.map((m) => {
          const isActive = m.key === active
          return (
            <button
              key={m.key}
              onClick={() => onNavigate(m.step)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-all',
                isActive
                  ? 'bg-[#1e6bf2] text-white shadow-md shadow-blue-900/30'
                  : 'text-blue-100/85 hover:bg-white/10 hover:text-white'
              )}
            >
              <m.icon className="h-5 w-5" aria-hidden />
              {m.label}
            </button>
          )
        })}
      </nav>
      <div className="px-4 pb-6 pt-4">
        <div className="rounded-xl bg-white/10 p-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-300" aria-hidden />
            <p className="text-[13.5px] font-bold text-white">Sistem Aktif</p>
          </div>
          <p className="mt-1 text-[12.5px] leading-snug text-blue-100/70">
            Pengecekan anomali berjalan otomatis setiap hari
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Header mobile (hamburger)
// ============================================================
export function MobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-blue-100 bg-white px-4 py-3 lg:hidden">
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMenu}
          aria-label="Buka menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 text-[#0e2a4d] active:bg-blue-50"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Image
          src="/jamkrindo-logo.png"
          alt="Logo Jamkrindo"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-lg"
        />
        <div className="min-w-0">
          <p className="truncate text-[15.5px] font-extrabold leading-tight text-[#0e2a4d]">
            Data Anomaly Monitoring
          </p>
          <p className="text-[12.5px] text-slate-500">Jamkrindo</p>
        </div>
      </div>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[13px] font-extrabold text-[#1e6bf2]">
        DS
      </span>
    </header>
  )
}

// ============================================================
// Header desktop dalam area konten
// ============================================================
export function PageHeader() {
  return (
    <div className="hidden flex-wrap items-center justify-between gap-4 border-b border-blue-100/70 px-6 py-4 lg:flex lg:px-8">
      <div>
        <h1 className="text-[21px] font-extrabold tracking-tight text-[#0e2a4d]">
          Data Anomaly Monitoring
        </h1>
        <p className="mt-1 text-[14px] font-medium text-slate-500">
          Monitoring &amp; Validasi Data Realisasi Kredit Bank Mitra
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-lg border border-blue-100 bg-white px-4 py-2 text-[13.5px] font-semibold text-slate-600 sm:block">
          Periode Oktober 2025
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[13.5px] font-extrabold text-[#1e6bf2]">
          DS
        </span>
      </div>
    </div>
  )
}

// ============================================================
// Kartu layar (white rounded card utk tiap layar alur)
// ============================================================
export function ScreenCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'jk-fade-up mx-auto w-full max-w-5xl rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_10px_35px_-12px_rgba(30,107,242,0.18)] sm:p-6 lg:p-7',
        className
      )}
    >
      {children}
    </div>
  )
}

// Judul layar dgn ikon bulat (kalendar, cloud, dsb.)
export function ScreenTitle({
  icon: Icon,
  title,
  description,
  iconClass = 'bg-blue-50 text-[#1e6bf2]',
  backLabel,
  onBack,
}: {
  icon: React.ElementType
  title: string
  description?: string
  iconClass?: string
  backLabel?: string
  onBack?: () => void
}) {
  return (
    <div className="mb-6">
      {backLabel && onBack && (
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-[14.5px] font-bold text-[#1e6bf2] hover:underline"
        >
          <ChevronLeft className="h-4.5 w-4.5" /> {backLabel}
        </button>
      )}
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            iconClass
          )}
          aria-hidden
        >
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-[21px] font-extrabold leading-tight text-[#0e2a4d]">
            {title}
          </h2>
          {description && (
            <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Badge status
// ============================================================
const STATUS_STYLE: Record<StatusAnomali, string> = {
  Baru: 'bg-red-50 text-red-600 ring-red-200',
  Menunggu: 'bg-amber-50 text-amber-600 ring-amber-200',
  'Dalam verifikasi': 'bg-blue-50 text-blue-600 ring-blue-200',
  'Siap dikoreksi': 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  Eskalasi: 'bg-rose-50 text-rose-600 ring-rose-200',
  Selesai: 'bg-green-50 text-green-700 ring-green-200',
}

export function StatusBadge({ status }: { status: StatusAnomali }) {
  return (
    <span
      className={cn(
        'inline-block whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-bold ring-1',
        STATUS_STYLE[status]
      )}
    >
      {status}
    </span>
  )
}

export function RedBadge({ text }: { text: string }) {
  return (
    <span className="inline-block rounded-md bg-red-50 px-3 py-1.5 text-[13.5px] font-bold text-red-600 ring-1 ring-red-200">
      {text}
    </span>
  )
}

export function AmberBadge({ text }: { text: string }) {
  return (
    <span className="inline-block rounded-md bg-amber-50 px-3 py-1.5 text-[13.5px] font-bold text-amber-600 ring-1 ring-amber-200">
      {text}
    </span>
  )
}

// ============================================================
// Baris label-nilai (Informasi Debitur, Konfirmasi Bank, dll.)
// ============================================================
export function KVRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-3">
      <span className="text-[14.5px] font-semibold text-slate-500">{label}</span>
      <div className="text-[14.5px] font-bold text-[#0e2a4d]">{children}</div>
    </div>
  )
}

// ============================================================
// Tombol biru besar (aksi utama tiap langkah)
// ============================================================
export function PrimaryAction({
  onClick,
  disabled,
  loading,
  children,
  outline,
  type = 'button',
}: {
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  outline?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'flex h-12 w-full items-center justify-center gap-2.5 rounded-xl text-[15px] font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e6bf2]/40 focus-visible:ring-offset-2',
        outline
          ? 'border-2 border-[#1e6bf2] bg-white text-[#1e6bf2] hover:bg-blue-50'
          : 'bg-[#1e6bf2] text-white shadow-md shadow-blue-500/25 hover:bg-[#1a5cd6] active:scale-[0.99]',
        (disabled || loading) && 'cursor-not-allowed opacity-60'
      )}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

// ============================================================
// Ikon kecil status penanganan (kotak rounded berwarna)
// ============================================================
export function StatusPenangananIcon({
  icon,
  color,
}: {
  icon: string
  color: string
}) {
  const cls = 'h-4 w-4 text-white'
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {icon === 'plus' && <Plus className={cls} />}
      {icon === 'clock' && <Clock className={cls} />}
      {icon === 'search' && <Search className={cls} />}
      {icon === 'wrench' && <Wrench className={cls} />}
      {icon === 'up' && <ArrowUpRight className={cls} />}
      {icon === 'check' && <Check className={cls} />}
    </span>
  )
}
