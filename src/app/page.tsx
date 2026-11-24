'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import { ANOMALI_ROWS, STEP_NAMES, DASH, type AnomaliRow } from '@/lib/jamkrindo-data'
import {
  SidebarContent,
  MobileHeader,
  PageHeader,
  type MenuKey,
} from '@/components/jamkrindo/shared'
import { DashboardScreen } from '@/components/jamkrindo/dashboard-screen'
import {
  PeriodeScreen,
  PortalScreen,
  ImportScreen,
  ValidasiScreen,
  PengecekanScreen,
} from '@/components/jamkrindo/flow-screens'
import { HasilScreen, DetailScreen } from '@/components/jamkrindo/result-screens'
import {
  KonfirmasiScreen,
  EvidenceScreen,
  TindakLanjutScreen,
} from '@/components/jamkrindo/action-screens'
import {
  LaporanScreen,
  SelesaiScreen,
  PengaturanScreen,
} from '@/components/jamkrindo/report-screens'

type Screen = number | 'pengaturan'

function menuKeyFromScreen(s: Screen): MenuKey {
  if (s === 'pengaturan') return 'pengaturan'
  if (s === 1) return 'dashboard'
  if (s === 4 || s === 5 || s === 6) return 'upload'
  if (s === 7 || s === 8 || s === 9 || s === 10 || s === 11) return 'anomali'
  if (s === 12 || s === 13) return 'laporan'
  return 'dashboard'
}

export default function Home() {
  const { toast } = useToast()
  const [screen, setScreen] = useState<Screen>(1)
  const [menuOpen, setMenuOpen] = useState(false)

  // state alur
  const [bulanDiperiksa, setBulanDiperiksa] = useState('Oktober 2025')
  const [bulanSebelum, setBulanSebelum] = useState('September 2025')
  const [fileUploaded, setFileUploaded] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomaliRow | null>(null)

  const go = useCallback((n: number | 'pengaturan') => {
    setScreen(n)
    setMenuOpen(false)
    if (typeof n === 'number') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // ---------- aksi alur ----------
  const handleDownloadDWH = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1800))
    toast({
      title: 'Data DWH berhasil diunduh',
      description: `Realisasi kredit ${bulanSebelum} siap diimpor.`,
    })
    go(4)
  }, [bulanSebelum, toast, go])

  const handleProsesData = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1200))
    toast({
      title: 'Data berhasil diproses',
      description: 'Melanjutkan ke validasi format & kelengkapan data.',
    })
    go(5)
  }, [toast, go])

  const handlePengecekanSelesai = useCallback(() => {
    toast({
      title: 'Pengecekan selesai',
      description: `Ditemukan ${DASH.dataAnomali} anomali dari ${DASH.totalData.toLocaleString('id-ID')} data.`,
    })
    go(7)
  }, [toast, go])

  const handleVerifikasi = useCallback(
    (row: AnomaliRow) => {
      toast({
        title: 'Anomali diverifikasi',
        description: `${row.noDebitur} - ${row.nama}. Lanjut konfirmasi ke bank mitra.`,
      })
      go(9)
    },
    [toast, go]
  )

  const handleKirimPermintaan = useCallback(
    async (pesan: string) => {
      await new Promise((r) => setTimeout(r, 1000))
      toast({
        title: 'Permintaan terkirim',
        description: 'Permintaan evidence telah dikirim ke Bank Mandiri.',
      })
      go(10)
    },
    [toast, go]
  )

  const handleSimpanTindakLanjut = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 900))
    toast({
      title: 'Tindak lanjut tersimpan',
      description: 'Status anomali diperbarui. Siap menyusun laporan.',
    })
    go(12)
  }, [toast, go])

  // ---------- unduh laporan CSV ----------
  const handleUnduhLaporan = useCallback(() => {
    const header = 'No,No. Debitur,Nama,Jenis Anomali,Nilai Bermasalah,Status\n'
    const body = ANOMALI_ROWS.map(
      (r, i) =>
        `${i + 1},${r.noDebitur},"${r.nama}",${r.jenis},"${r.nilaiBermasalah}",${r.status}`
    ).join('\n')
    const rekap =
      `\n\nRekap Anomali per Jenis\n` +
      `KTP / NPWB,78\nUsia & Tanggal Lahir,52\nSkema Kredit,45\nTanggal SP,38\nData Lainnya,35\n` +
      `\nTotal Data,${DASH.totalData}\nTotal Anomali,${DASH.dataAnomali}\nPeriode,${DASH.sumberPeriode}`
    const blob = new Blob(['\uFEFF' + header + body + rekap], {
      type: 'text/csv;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'laporan_anomali_september_2025.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: 'Laporan berhasil diunduh',
      description: 'laporan_anomali_september_2025.csv tersimpan di perangkat Anda.',
    })
  }, [toast])

  const stepName = useMemo(
    () => (screen === 'pengaturan' ? 'Pengaturan' : STEP_NAMES[screen]),
    [screen]
  )

  return (
    <div className="min-h-screen bg-[#f3f7fb]">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block" aria-label="Sidebar">
        <SidebarContent
          active={menuKeyFromScreen(screen)}
          onNavigate={(s) => go(s as Screen)}
        />
      </aside>

      {/* Sidebar mobile (Sheet) */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 border-0 bg-transparent p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu Navigasi</SheetTitle>
          </SheetHeader>
          <SidebarContent
            active={menuKeyFromScreen(screen)}
            onNavigate={(s) => go(s as Screen)}
          />
        </SheetContent>
      </Sheet>

      {/* Konten */}
      <div className="lg:pl-64">
        <MobileHeader onOpenMenu={() => setMenuOpen(true)} />
        <PageHeader />

        <main className="px-4 py-6 lg:px-8 lg:py-8" aria-label={stepName}>
          {screen === 1 && (
            <DashboardScreen onMulaiPengecekan={() => go(2)} />
          )}

          {screen === 2 && (
            <PeriodeScreen
              bulanDiperiksa={bulanDiperiksa}
              bulanSebelum={bulanSebelum}
              onChangeBulan={setBulanDiperiksa}
              onChangeSebelum={setBulanSebelum}
              onLanjut={() => go(3)}
              onBack={() => go(1)}
            />
          )}

          {screen === 3 && <PortalScreen onDownload={handleDownloadDWH} onBack={() => go(2)} />}

          {screen === 4 && (
            <ImportScreen
              fileUploaded={fileUploaded}
              onUpload={() => {
                setFileUploaded(true)
                toast({
                  title: 'File siap diproses',
                  description: 'realisasi_kredit_september_2025.xlsx (2.4 MB) telah diunggah.',
                })
              }}
              onProses={handleProsesData}
              onBack={() => go(3)}
            />
          )}

          {screen === 5 && <ValidasiScreen onLanjut={() => go(6)} onBack={() => go(4)} />}

          {screen === 6 && (
            <PengecekanScreen onSelesai={handlePengecekanSelesai} onBack={() => go(5)} />
          )}

          {screen === 7 && (
            <HasilScreen
              onOpenDetail={(row) => {
                setSelectedAnomaly(row)
                go(8)
              }}
            />
          )}

          {screen === 8 && selectedAnomaly && (
            <DetailScreen
              row={selectedAnomaly}
              onKembali={() => go(7)}
              onLihatEvidence={() =>
                toast({
                  title: 'Evidence belum tersedia',
                  description: 'Kirim permintaan evidence ke bank mitra terlebih dahulu.',
                })
              }
              onVerifikasi={() => handleVerifikasi(selectedAnomaly)}
            />
          )}

          {screen === 9 && <KonfirmasiScreen onKirim={handleKirimPermintaan} row={selectedAnomaly} />}

          {screen === 10 && <EvidenceScreen onLanjut={() => go(11)} />}

          {screen === 11 && <TindakLanjutScreen onSimpan={handleSimpanTindakLanjut} />}

          {screen === 12 && <LaporanScreen onUnduh={handleUnduhLaporan} />}

          {screen === 13 && (
            <SelesaiScreen onKembali={() => go(1)} onUnduh={handleUnduhLaporan} />
          )}

          {screen === 'pengaturan' && <PengaturanScreen />}
        </main>
      </div>
    </div>
  )
}
