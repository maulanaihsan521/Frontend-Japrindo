// ============================================================
// Data & tipe untuk aplikasi Jamkrindo — Data Anomaly Monitoring
// Angka mengikuti desain UI (mockup 13 langkah).
// ============================================================

export type StatusAnomali =
  | "Baru"
  | "Menunggu"
  | "Dalam verifikasi"
  | "Siap dikoreksi"
  | "Eskalasi"
  | "Selesai"

export interface AnomaliRow {
  id: number
  noDebitur: string
  nama: string
  noKtp: string
  tanggalLahir: string
  usia: string
  jenis: string // tampil di tabel: Usia / Skema Kredit / KTP/NPWB / SP / Tanggal Lahir / Tanggal SP / Data Lainnya
  kelompok: "ktp" | "usia" | "skema" | "lainnya" // untuk tab filter
  nilaiBermasalah: string
  status: StatusAnomali
  jenisLengkap: string // badge merah di layar detail
  rekomendasi: string
}

// ---------- Ringkasan dashboard ----------
export const DASH = {
  totalData: 12532,
  dataAnomali: 248,
  totalBankMitra: 15,
  selesaiDitangani: 180,
  periode: "Oktober 2025",
  sumberPeriode: "September 2025",
  rentangPeriode: "01/09/2025 - 30/09/2025",
}

// Anomali per jenis (donut dashboard) — jumlah = 248
export const ANOMALI_PER_JENIS = [
  { label: "KTP / NPWB", value: 78, color: "#4A8CF7" },
  { label: "Usia & Tanggal Lahir", value: 52, color: "#6C4FE0" },
  { label: "Skema Kredit", value: 45, color: "#35C46B" },
  { label: "Tanggal SP", value: 38, color: "#F6B93B" },
  { label: "Data Lainnya", value: 35, color: "#E9574E" },
]

export const STATUS_PENANGANAN = [
  { label: "Baru ditemukan", value: 45, color: "#34A853", icon: "plus" },
  { label: "Menunggu evidence", value: 62, color: "#F2B21C", icon: "clock" },
  { label: "Dalam verifikasi", value: 48, color: "#5E7E9B", icon: "search" },
  { label: "Siap dikoreksi", value: 32, color: "#E04B3A", icon: "wrench" },
  { label: "Eskalasi ke pusat", value: 21, color: "#D643A8", icon: "up" },
  { label: "Selesai", value: 40, color: "#2BB673", icon: "check" },
] as const

// ---------- Daftar anomali (248 baris, 5 baris pertama persis mockup) ----------
const NAMA = [
  "Budi Santoso", "Siti Rahayu", "Agus Wibowo", "Dewi Lestari", "Rudi Hartono",
  "Sri Wahyuni", "Joko Prasetyo", "Rina Marlina", "Hendra Gunawan", "Fitri Handayani",
  "Bambang Sutrisno", "Maya Anggraini", "Andi Saputra", "Nur Aini", "Eko Purnomo",
  "Lilis Suryani", "Dedi Kurniawan", "Wulan Sari", "Taufik Hidayat", "Ratna Dewi",
  "Slamet Riyadi", "Indah Permatasari", "Yusuf Maulana", "Citra Kirana", "Hadi Wijaya",
  "Mega Utami", "Rizky Ramadhan", "Anisa Fitria", "Doni Firmansyah", "Puji Astuti",
]

const NILAI: Record<string, string[]> = {
  "KTP/NPWB": ["KTP kosong", "Nomor KTP duplikat", "Format NIK tidak valid", "NPWP tidak sesuai nama"],
  Usia: ["Usia 2 tahun", "Usia 15 tahun", "Usia melebihi 70 tahun", "Usia tidak valid"],
  "Skema Kredit": ["Plafon 60 jt (mikro)", "Plafon di luar skema", "Tenor 36 bulan (mikro)", "Skema tidak terdaftar"],
  SP: ["SP > jatuh tempo", "SP belum diterbitkan", "Nomor SP ganda"],
  "Tanggal Lahir": ["Tgl lahir tidak valid", "Tgl lahir kosong"],
  "Tanggal SP": ["Tanggal SP mundur", "Format tanggal SP salah"],
  "Data Lainnya": ["Data tidak lengkap", "Nilai plafon negatif", "Kode cabang tidak dikenal"],
}

const STATUS_POOL: StatusAnomali[] = [
  "Baru", "Menunggu", "Dalam verifikasi", "Siap dikoreksi", "Eskalasi", "Selesai",
]

const JENIS_LONG: Record<string, string> = {
  "KTP/NPWB": "Nomor KTP / NPWP tidak valid",
  Usia: "Usia (kurang dari 17 tahun)",
  "Skema Kredit": "Skema kredit tidak sesuai ketentuan",
  SP: "Surat Penetapan (SP) bermasalah",
  "Tanggal Lahir": "Tanggal lahir tidak valid",
  "Tanggal SP": "Tanggal SP tidak valid",
  "Data Lainnya": "Anomali data lainnya",
}

const REKOM: Record<string, string> = {
  "KTP/NPWB": "Minta evidence KTP ke bank mitra",
  Usia: "Minta evidence KTP ke bank mitra",
  "Skema Kredit": "Verifikasi skema kredit ke bank mitra",
  SP: "Periksa ulang penerbitan SP dengan bank mitra",
  "Tanggal Lahir": "Minta evidence dokumen identitas ke bank mitra",
  "Tanggal SP": "Periksa ulang tanggal SP dengan bank mitra",
  "Data Lainnya": "Periksa kelengkapan data dengan bank mitra",
}

function tglLahirDari(usiaTahun: number, idx: number): string {
  // tahun lahir konsisten dgn usia thd 2025
  const y = 2025 - usiaTahun
  const m = ((idx * 5) % 12) + 1
  const d = ((idx * 7) % 27) + 1
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function hashRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function buildRows(): AnomaliRow[] {
  // komposisi persis mengikuti mockup (total 248):
  // KTP/NPWB 78 | Usia 30 + Tgl Lahir 22 | Skema Kredit 45 | SP 26 + Tgl SP 12 | Data Lainnya 35
  const PLAN: Array<{ jenis: string; kelompok: AnomaliRow["kelompok"]; count: number }> = [
    { jenis: "KTP/NPWB", kelompok: "ktp", count: 78 },
    { jenis: "Usia", kelompok: "usia", count: 30 },
    { jenis: "Tanggal Lahir", kelompok: "usia", count: 22 },
    { jenis: "Skema Kredit", kelompok: "skema", count: 45 },
    { jenis: "SP", kelompok: "lainnya", count: 26 },
    { jenis: "Tanggal SP", kelompok: "lainnya", count: 12 },
    { jenis: "Data Lainnya", kelompok: "lainnya", count: 35 },
  ]

  // 5 baris pertama persis seperti mockup (sudah termasuk dalam PLAN)
  const first5: Partial<AnomaliRow>[] = [
    { noDebitur: "D0012345", jenis: "Usia", kelompok: "usia", nilaiBermasalah: "Usia 2 tahun", status: "Baru", nama: "Budi Santoso" },
    { noDebitur: "D0012346", jenis: "Skema Kredit", kelompok: "skema", nilaiBermasalah: "Plafon 60 jt (mikro)", status: "Menunggu" },
    { noDebitur: "D0012347", jenis: "KTP/NPWB", kelompok: "ktp", nilaiBermasalah: "KTP kosong", status: "Dalam verifikasi" },
    { noDebitur: "D0012348", jenis: "SP", kelompok: "lainnya", nilaiBermasalah: "SP > jatuh tempo", status: "Siap dikoreksi" },
    { noDebitur: "D0012349", jenis: "Tanggal Lahir", kelompok: "usia", nilaiBermasalah: "Tgl lahir tidak valid", status: "Eskalasi" },
  ]

  // urutkan antar kategori (round-robin) agar halaman pertama variatif
  const buckets = PLAN.map((p) => ({
    jenis: p.jenis,
    kelompok: p.kelompok,
    items: Array.from({ length: p.count }, () => p.jenis),
  }))
  const templates: { jenis: string; kelompok: AnomaliRow["kelompok"] }[] = []
  let added = true
  const cursor = buckets.map(() => 0)
  while (added) {
    added = false
    for (let b = 0; b < buckets.length; b++) {
      if (cursor[b] < buckets[b].items.length) {
        templates.push({ jenis: buckets[b].jenis, kelompok: buckets[b].kelompok })
        cursor[b]++
        added = true
      }
    }
  }

  let seq = 2350
  const rows: AnomaliRow[] = templates.map((t, idx) => {
    const r = hashRand((idx + 1) * 13.37)
    const isFirst5 = idx < 5
    const f5 = isFirst5 ? first5[idx] : undefined
    const jenis = f5?.jenis ?? t.jenis
    const nama = f5?.nama ?? NAMA[Math.floor(r * NAMA.length) % NAMA.length]
    const noDebitur = f5?.noDebitur ?? `D00${seq++}`
    const nilaiBermasalah = f5?.nilaiBermasalah ?? NILAI[jenis][Math.floor(r * NILAI[jenis].length) % NILAI[jenis].length]
    const status = f5?.status ?? STATUS_POOL[Math.floor(r * STATUS_POOL.length) % STATUS_POOL.length]

    // usia & tanggal lahir konsisten dgn nilai bermasalah
    let usiaTahun = 30 + (Math.floor(r * 20) % 25)
    if (jenis === "Usia" && nilaiBermasalah.startsWith("Usia ")) {
      const parsed = parseInt(nilaiBermasalah.replace(/[^0-9]/g, ""), 10)
      if (!isNaN(parsed)) usiaTahun = parsed
    } else if (jenis === "Usia") {
      usiaTahun = 15 + (Math.floor(r * 3) % 3)
    } else if (jenis === "Tanggal Lahir") {
      usiaTahun = 25 + (Math.floor(r * 15) % 20)
    }

    const noKtp = idx === 0
      ? "1234567890123456"
      : `32${String(Math.floor(r * 1e12)).padStart(14, "0").slice(0, 14)}`

    return {
      id: idx + 1,
      noDebitur,
      nama,
      noKtp,
      tanggalLahir: tglLahirDari(usiaTahun, idx + 1),
      usia: `${usiaTahun} tahun`,
      jenis,
      kelompok: f5?.kelompok ?? t.kelompok,
      nilaiBermasalah,
      status,
      jenisLengkap: JENIS_LONG[jenis],
      rekomendasi: REKOM[jenis],
    }
  })
  return rows
}

export const ANOMALI_ROWS: AnomaliRow[] = buildRows()

// ---------- Layar 6: jenis pengecekan otomatis ----------
export const CEK_OTOMATIS = [
  { label: "Nomor KTP / NPWB", icon: "id" },
  { label: "Usia & Tanggal Lahir", icon: "user" },
  { label: "Skema Kredit", icon: "chart" },
  { label: "Penerbitan SP", icon: "doc" },
  { label: "Data Lainnya", icon: "data" },
] as const

// ---------- Layar 9: konfirmasi bank ----------
export const KONFIRMASI_BANK = {
  bankMitra: "Bank Mandiri",
  jenisAnomali: "Usia",
  jumlahData: 12,
  permintaanEvidence: "Minta KTP dan dokumen pendukung lainnya.",
  pesanDefault:
    "Mohon kirimkan evidence berupa KTP dan dokumen pendukung untuk data debitur dengan No. Referensi D0012346.",
}

// ---------- Layar 10: file evidence ----------
export const EVIDENCE_FILES = [
  { nama: "KTP_D0012346.pdf", ukuran: "1.2 MB" },
  { nama: "PK_D0012346.pdf", ukuran: "2.4 MB" },
]

// ---------- Layar 4: file import ----------
export const IMPORT_FILE = {
  nama: "realisasi_kredit_september_2025.xlsx",
  ukuran: "2.4 MB",
}

export const formatRibuan = (n: number) => n.toLocaleString("id-ID")

const BULAN_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

// "2023-06-08" -> "08 Juni 2023" (aman utk format tidak valid)
export const formatTanggalID = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[3]} ${BULAN_ID[Number(m[2]) - 1]} ${m[1]}`
}

// Nama langkah (untuk step navigator)
export const STEP_NAMES: Record<number, string> = {
  1: "Dashboard Awal",
  2: "Tentukan Periode Data",
  3: "Download Data DWH",
  4: "Import Data",
  5: "Validasi Data",
  6: "Pengecekan Anomali",
  7: "Hasil Pengecekan Anomali",
  8: "Detail Anomali",
  9: "Konfirmasi ke Bank Mitra",
  10: "Upload Evidence",
  11: "Tindak Lanjut & Koreksi",
  12: "Laporan Hasil Pengecekan",
  13: "Selesai",
}
