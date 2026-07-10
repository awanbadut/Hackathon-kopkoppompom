export interface ParsedNIK {
  isValid: boolean;
  error?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  jenisKelamin?: 'LAKI-LAKI' | 'PEREMPUAN';
  tanggalLahir?: string;
  umur?: number;
}

const PROVINSI_MAP: { [key: string]: string } = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kepulauan Bangka Belitung',
  '21': 'Kepulauan Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua Barat',
  '92': 'Papua',
};

const KABUPATEN_MAP: { [key: string]: string } = {
  '32.01': 'Kabupaten Bogor',
  '32.71': 'Kota Bogor',
  '31.71': 'Kota Jakarta Pusat',
  '31.73': 'Kota Jakarta Barat',
  '31.74': 'Kota Jakarta Selatan',
  '35.78': 'Kota Surabaya',
};

const KECAMATAN_MAP: { [key: string]: string } = {
  '32.01.01': 'Kecamatan Ciawi',
  '32.01.02': 'Kecamatan Megamendung',
  '31.71.01': 'Kecamatan Gambir',
  '35.78.01': 'Kecamatan Tegalsari',
};

export function parseNIK(nik: string): ParsedNIK {
  if (!nik) {
    return { isValid: false, error: 'NIK kosong.' };
  }

  const cleanNik = nik.trim().replace(/\D/g, '');

  if (cleanNik.length !== 16) {
    return { isValid: false, error: 'NIK harus tepat 16 digit angka.' };
  }

  const provCode = cleanNik.substring(0, 2);
  const kabCode = cleanNik.substring(0, 4);
  const kecCode = cleanNik.substring(0, 6);

  const provinsi = PROVINSI_MAP[provCode] || `Provinsi Kode ${provCode}`;
  const kabupaten = KABUPATEN_MAP[kabCode] || `Kabupaten Kode ${kabCode.substring(2)}`;
  const kecamatan = KECAMATAN_MAP[kecCode] || `Kecamatan Kode ${kecCode.substring(4)}`;

  // Parse birth date and gender
  let day = parseInt(cleanNik.substring(6, 8), 10);
  const monthCode = cleanNik.substring(8, 10);
  let year = parseInt(cleanNik.substring(10, 12), 10);

  let jenisKelamin: 'LAKI-LAKI' | 'PEREMPUAN' = 'LAKI-LAKI';
  if (day > 40) {
    jenisKelamin = 'PEREMPUAN';
    day -= 40;
  }

  // Determine full year (2000s or 1900s)
  const currentYear = new Date().getFullYear();
  const currentYearLastTwo = currentYear % 100;
  
  // If year in NIK is less than or equal to current year last 2 digits, assume 2000s, else 1900s
  const fullYear = year <= currentYearLastTwo ? 2000 + year : 1900 + year;

  const birthDateStr = `${fullYear}-${monthCode}-${String(day).padStart(2, '0')}`;
  const birthDate = new Date(birthDateStr);

  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: 'Format tanggal lahir pada NIK tidak valid.' };
  }

  // Calculate age
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  const umur = Math.abs(ageDate.getUTCFullYear() - 1970);

  return {
    isValid: true,
    provinsi,
    kabupaten,
    kecamatan,
    jenisKelamin,
    tanggalLahir: birthDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    umur,
  };
}
