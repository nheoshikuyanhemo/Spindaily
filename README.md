# Spindaily
### Experiment

## Berikut adalah langkah-langkah lengkap instalasi dan menjalankan auto daily spin PLUME di Termux, menggunakan Node.js, Ethers.js, dan .env:


---

✅ 1. Persiapan Awal di Termux

```
pkg update && pkg upgrade -y
pkg install nodejs git nano -y
pkg install git -y
```

---

✅ 2. Buat Folder Project dan Masuk ke Dalamnya

```
mkdir auto-spin-plume && cd auto-spin-plume
```


---

✅ 3. Inisialisasi Proyek Node.js dan Instal Dependensi

```
npm init -y
npm install ethers dotenv
```


---

✅ 4. Buat File Konfigurasi .env

```
nano .env
```

Lalu isi dengan data berikut:

```
PRIVATE_KEY=isi_private_key_kamu
PLUME_RPC=https://rpc.phoenix.plume.xyz
SPIN_CONTRACT=0xB8e9F72bd52575B61705e4376970E14C9F573D71
```

> ⚠️ Gantilah PRIVATE_KEY dengan private key wallet-mu (tanpa 0x).




---

✅ 5. pindahkan script ke folder yang telah di buat atau langsung gitclone


---
✅ 6. run script 

```
node spin.mjs
```
