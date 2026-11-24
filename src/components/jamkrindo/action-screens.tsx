'use client'

import React, { useEffect, useState } from 'react'
import {
  Landmark,
  CloudUpload,
  FileDown,
  FileText,
  CheckCircle2,
  Check,
} from 'lucide-react'
import {
  KONFIRMASI_BANK,
  EVIDENCE_FILES,
  type AnomaliRow,
} from '@/lib/jamkrindo-data'
import { ScreenCard, ScreenTitle, RedBadge, KVRow, PrimaryAction } from './shared'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

// ============================================================
// LAYAR 9 — Konfirmasi ke Bank Mitra
// ============================================================
function pesanUntuk(row?: AnomaliRow | null): string {
  if (!row) return KONFIRMASI_BANK.pesanDefault
  return (
    `Mohon kirimkan evidence berupa KTP dan dokumen pendukung untuk data debitur ` +
    `a.n. ${row.nama} (No. Referensi ${row.noDebitur}).`
  )
}

export function KonfirmasiScreen({
  onKirim,
  row,
}: {
  onKirim: (pesan: string) => Promise<void> | void
  row?: AnomaliRow | null
}) {
  const [pesan, setPesan] = useState(() => pesanUntuk(row))
  const [mengirim, setMengirim] = useState(false)

  const handle = async () => {
    setMengirim(true)
    await onKirim(pesan)
    setMengirim(false)
  }

  return (
    <ScreenCard>
      <ScreenTitle
        icon={Landmark}
        title="Konfirmasi ke Bank Mitra"
        description="Minta bukti pendukung (evidence) untuk validasi data."
      />

      <div className="divide-y divide-blue-50 rounded-2xl border border-blue-100 px-6">
        <KVRow label="Bank Mitra">{KONFIRMASI_BANK.bankMitra}</KVRow>
        <KVRow label="Jenis Anomali">
          <RedBadge text={row?.jenis ?? KONFIRMASI_BANK.jenisAnomali} />
        </KVRow>
        <KVRow label="No. Debitur">{row?.noDebitur ?? '—'}</KVRow>
        <KVRow label="Jumlah Data">{KONFIRMASI_BANK.jumlahData}</KVRow>
        <KVRow label="Permintaan Evidence">
          <span className="font-semibold text-slate-600">
            {KONFIRMASI_BANK.permintaanEvidence}
          </span>
        </KVRow>
      </div>

      <div className="mt-5">
        <Label htmlFor="pesan-bank" className="text-[14.5px] font-extrabold text-[#0e2a4d]">
          Pesan ke Bank Mitra
        </Label>
        <Textarea
          id="pesan-bank"
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          rows={4}
          className="mt-2.5 resize-none rounded-xl border-blue-100 bg-blue-50/40 text-[14.5px] font-semibold text-[#0e2a4d] focus-visible:ring-[#1e6bf2]/30"
        />
      </div>

      <div className="mt-6">
        <PrimaryAction onClick={handle} loading={mengirim}>
          {mengirim ? 'Mengirim...' : 'Kirim Permintaan'}
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 10 — Upload Evidence (verifikasi dokumen bank mitra)
// ============================================================
export function EvidenceScreen({ onLanjut }: { onLanjut: () => void }) {
  const [cek, setCek] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCek(true), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <ScreenCard>
      <ScreenTitle
        icon={CloudUpload}
        title="Upload Evidence"
        description="Bank mitra telah mengirimkan evidence. Silakan verifikasi dokumen yang diterima."
      />

      <p className="mb-2.5 text-[14.5px] font-bold text-[#0e2a4d]">File Evidence</p>
      <ul className="space-y-3">
        {EVIDENCE_FILES.map((f) => (
          <li
            key={f.nama}
            className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-5 py-3.5 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50" aria-hidden>
              <FileText className="h-5 w-5 text-red-500" />
            </span>
            <div className="flex-1">
              <p className="text-[14.5px] font-bold text-[#0e2a4d]">{f.nama}</p>
              <p className="text-[13px] text-slate-400">{f.ukuran}</p>
            </div>
            <button
              aria-label={`Unduh ${f.nama}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-[#1e6bf2]"
            >
              <FileDown className="h-5 w-5" />
            </button>
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-all',
                cek ? 'bg-emerald-500 jk-fade-up' : 'bg-slate-200'
              )}
              aria-hidden
            >
              {cek && <Check className="h-4.5 w-4.5 text-white" />}
            </span>
          </li>
        ))}
      </ul>

      {cek ? (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 jk-fade-up">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500" aria-hidden>
            <Check className="h-5.5 w-5.5 text-white" />
          </span>
          <div>
            <p className="text-[15px] font-extrabold text-emerald-700">Evidence valid</p>
            <p className="text-[14px] font-semibold text-emerald-600/90">
              Data sesuai dengan dokumen yang diterima.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
          <span
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#1e6bf2] border-t-transparent"
            aria-hidden
          />
          <p className="text-[14.5px] font-bold text-[#1e6bf2] jk-pulse-text">
            Memverifikasi dokumen evidence...
          </p>
        </div>
      )}

      <div className="mt-6">
        <PrimaryAction onClick={onLanjut} disabled={!cek}>
          Lanjutkan
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}

// ============================================================
// LAYAR 11 — Tindak Lanjut & Koreksi
// ============================================================
export function TindakLanjutScreen({ onSimpan }: { onSimpan: () => Promise<void> | void }) {
  const [koreksi, setKoreksi] = useState('ya')
  const [tindakan, setTindakan] = useState('koreksi-internal')
  const [catatan, setCatatan] = useState(
    'Sudah dikonfirmasi dengan KTP. Data sudah diperbaiki.'
  )
  const [menyimpan, setMenyimpan] = useState(false)

  const handle = async () => {
    setMenyimpan(true)
    await onSimpan()
    setMenyimpan(false)
  }

  return (
    <ScreenCard>
      <ScreenTitle
        icon={CheckCircle2}
        title="Tindak Lanjut & Koreksi"
        description="Perbarui status anomali sesuai hasil verifikasi."
      />

      <p className="text-[14.5px] font-extrabold text-[#0e2a4d]">
        Apakah data dapat dikoreksi mandiri?
      </p>
      <RadioGroup
        value={koreksi}
        onValueChange={setKoreksi}
        className="mt-3.5 gap-3"
      >
        <div
          className={cn(
            'flex cursor-pointer items-center gap-3.5 rounded-xl border px-5 py-3.5 transition',
            koreksi === 'ya' ? 'border-[#1e6bf2] bg-blue-50/60' : 'border-blue-100 bg-white'
          )}
          onClick={() => setKoreksi('ya')}
        >
          <RadioGroupItem value="ya" id="koreksi-ya" />
          <Label htmlFor="koreksi-ya" className="cursor-pointer text-[14.5px] font-bold text-[#0e2a4d]">
            Ya (misal: KTP, usia, tanggal lahir, skema kredit)
          </Label>
        </div>
        <div
          className={cn(
            'flex cursor-pointer items-center gap-3.5 rounded-xl border px-5 py-3.5 transition',
            koreksi === 'tidak' ? 'border-[#1e6bf2] bg-blue-50/60' : 'border-blue-100 bg-white'
          )}
          onClick={() => setKoreksi('tidak')}
        >
          <RadioGroupItem value="tidak" id="koreksi-tidak" />
          <Label htmlFor="koreksi-tidak" className="cursor-pointer text-[14.5px] font-bold text-[#0e2a4d]">
            Tidak (misal: tanggal SP, HKS, dll)
          </Label>
        </div>
      </RadioGroup>

      <div className="mt-5">
        <Label htmlFor="tindakan" className="text-[14.5px] font-extrabold text-[#0e2a4d]">
          Tindakan
        </Label>
        <Select value={tindakan} onValueChange={setTindakan}>
          <SelectTrigger
            id="tindakan"
            className="mt-2.5 h-11 w-full rounded-xl border-blue-100 text-[14.5px] font-semibold text-[#0e2a4d]"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-[14px]">
            <SelectItem value="koreksi-internal">Koreksi data pada sistem internal</SelectItem>
            <SelectItem value="minta-bank">Minta bank mitra mengoreksi data</SelectItem>
            <SelectItem value="eskalasi">Eskalasi ke unit pusat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <Label htmlFor="catatan" className="text-[14.5px] font-extrabold text-[#0e2a4d]">
          Catatan
        </Label>
        <Textarea
          id="catatan"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          rows={4}
          className="mt-2.5 resize-none rounded-xl border-blue-100 text-[14.5px] font-semibold text-[#0e2a4d] focus-visible:ring-[#1e6bf2]/30"
        />
      </div>

      <div className="mt-6">
        <PrimaryAction onClick={handle} loading={menyimpan}>
          {menyimpan ? 'Menyimpan...' : 'Simpan Tindak Lanjut'}
        </PrimaryAction>
      </div>
    </ScreenCard>
  )
}
