'use client'

import React from 'react'
import { Database, AlertOctagon, Landmark, BadgeCheck, CalendarDays } from 'lucide-react'
import {
  DASH,
  ANOMALI_PER_JENIS,
  STATUS_PENANGANAN,
  formatRibuan,
} from '@/lib/jamkrindo-data'
import { StatusPenangananIcon } from './shared'

// ============================================================
// Donut chart SVG murni (tanpa dependensi tambahan)
// ============================================================
function DonutChart({ size = 200 }: { size?: number }) {
  const total = ANOMALI_PER_JENIS.reduce((s, d) => s + d.value, 0)
  const stroke = 26
  const r = (size - stroke) / 2 - 4
  const C = 2 * Math.PI * r
  const gap = C * 0.022 // celah kecil antar segmen seperti mockup

  // hitung segmen sebelum render (mulai dari pukul 12)
  const fracs = ANOMALI_PER_JENIS.map((d) => d.value / total)
  const segments = ANOMALI_PER_JENIS.map((d, i) => ({
    color: d.color,
    label: d.label,
    len: Math.max(C * fracs[i] - gap, 1),
    offset: C * 0.25 - C * fracs.slice(0, i).reduce((a, b) => a + b, 0),
  }))

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Diagram donat anomali per jenis"
      className="shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#eef3fb"
        strokeWidth={stroke}
      />
      {segments.map((s) => (
        <circle
          key={s.label}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={`${s.len} ${C - s.len}`}
          strokeDashoffset={s.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  dot,
}: {
  icon: React.ElementType
  label: string
  value: string
  iconBg: string
  iconColor: string
  dot: string
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_20px_-8px_rgba(30,107,242,0.15)] transition-shadow hover:shadow-[0_10px_28px_-8px_rgba(30,107,242,0.28)]">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
        aria-hidden
      >
        <Icon className="h-5.5 w-5.5" style={{ color: iconColor }} />
      </span>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-[13.5px] font-semibold text-slate-500">{label}</span>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: dot }}
          aria-hidden
        />
      </div>
      <p className="mt-1 text-[22px] font-extrabold tracking-tight text-[#0e2a4d] sm:text-[25px]">
        {value}
      </p>
    </div>
  )
}

export function DashboardScreen({ onMulaiPengecekan }: { onMulaiPengecekan: () => void }) {
  const total = ANOMALI_PER_JENIS.reduce((s, d) => s + d.value, 0)
  const persenSelesai = Math.round((DASH.selesaiDitangani / DASH.dataAnomali) * 100)

  return (
    <div className="jk-fade-up mx-auto w-full max-w-[1240px] space-y-6">
      {/* Sapaan + periode */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-extrabold text-[#0e2a4d]">Dashboard</h2>
          <p className="mt-1.5 text-[14.5px] text-slate-500">Halo, Desti</p>
          <p className="text-[14.5px] text-slate-500">
            Berikut ringkasan data anomali realisasi kredit
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-left shadow-sm">
          <CalendarDays className="h-5 w-5 text-[#1e6bf2]" aria-hidden />
          <span>
            <span className="block text-[12.5px] font-semibold text-slate-400">Periode</span>
            <span className="block text-[14.5px] font-extrabold text-[#0e2a4d]">
              {DASH.periode}
            </span>
          </span>
        </div>
      </div>

      {/* 4 kartu statistik */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-4">
        <StatCard
          icon={Database}
          label="Total Data"
          value={formatRibuan(DASH.totalData)}
          iconBg="#e6effd"
          iconColor="#1e6bf2"
          dot="#1e6bf2"
        />
        <StatCard
          icon={AlertOctagon}
          label="Data Anomali"
          value={formatRibuan(DASH.dataAnomali)}
          iconBg="#fdeaea"
          iconColor="#e04b3a"
          dot="#e04b3a"
        />
        <StatCard
          icon={Landmark}
          label="Total Bank Mitra"
          value={String(DASH.totalBankMitra)}
          iconBg="#e3f7ea"
          iconColor="#2bb673"
          dot="#2bb673"
        />
        <StatCard
          icon={BadgeCheck}
          label="Selesai Ditangani"
          value={String(DASH.selesaiDitangani)}
          iconBg="#efeafd"
          iconColor="#6c4fe0"
          dot="#6c4fe0"
        />
      </div>

      {/* Donut + status penanganan */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_6px_20px_-8px_rgba(30,107,242,0.15)]">
          <h3 className="text-[17px] font-extrabold text-[#0e2a4d]">Anomali per Jenis</h3>
          <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-7 sm:flex-row sm:gap-10">
            <DonutChart />
            <ul className="w-full max-w-md flex-1 space-y-3">
              {ANOMALI_PER_JENIS.map((d) => (
                <li key={d.label} className="flex items-center gap-3 text-[14.5px]">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: d.color }}
                    aria-hidden
                  />
                  <span className="flex-1 font-semibold text-slate-600">{d.label}</span>
                  <span className="text-[13.5px] font-semibold text-slate-400">
                    {d.value} data
                  </span>
                  <span className="w-12 text-right font-extrabold text-[#0e2a4d]">
                    {Math.round((d.value / total) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-[0_6px_20px_-8px_rgba(30,107,242,0.15)]">
          <h3 className="text-[17px] font-extrabold text-[#0e2a4d]">Status Penanganan</h3>
          <ul className="mt-5 space-y-3.5">
            {STATUS_PENANGANAN.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <StatusPenangananIcon icon={s.icon} color={s.color} />
                <span className="flex-1 text-[14.5px] font-semibold text-slate-600">
                  {s.label}
                </span>
                <span className="text-[15px] font-extrabold text-[#0e2a4d]">{s.value}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-bold text-slate-500">Progres Penyelesaian</span>
                <span className="text-[14.5px] font-extrabold text-emerald-600">{persenSelesai}%</span>
              </div>
              <div
                className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white"
                role="progressbar"
                aria-valuenow={persenSelesai}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progres penyelesaian anomali"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1e6bf2] to-emerald-500 transition-all duration-700"
                  style={{ width: `${persenSelesai}%` }}
                />
              </div>
              <p className="mt-2.5 text-[13px] font-semibold text-slate-400">
                {DASH.selesaiDitangani} dari {DASH.dataAnomali} anomali telah ditangani
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Aksi utama menuju alur pengecekan */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-[#0f2f57] to-[#1e6bf2] p-6 text-white shadow-[0_10px_30px_-10px_rgba(30,107,242,0.5)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[17px] font-extrabold">Mulai Pengecekan Anomali</p>
            <p className="mt-1 text-[14px] text-blue-100/90">
              Tentukan periode, unduh data DWH, dan proses pengecekan anomali kredit.
            </p>
          </div>
          <button
            onClick={onMulaiPengecekan}
            className="flex h-12 items-center rounded-xl bg-white px-6 text-[14.5px] font-extrabold text-[#1e6bf2] shadow transition hover:bg-blue-50 active:scale-[0.98]"
          >
            Mulai Proses
          </button>
        </div>
      </div>
    </div>
  )
}
