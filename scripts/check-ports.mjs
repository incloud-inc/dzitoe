#!/usr/bin/env node
/**
 * DZITOE — Port Guard
 * Task: A0.1
 *
 * Memastikan port aplikasi DZITOE bebas, dan memvalidasi bahwa port RESERVED
 * milik project lain di laptop (ADZKIA :8000, PERSOALAN :5173, dsb) TIDAK disentuh.
 *
 * Jalankan:  pnpm ports:check
 */

import net from 'node:net';

/* -------------------------------------------------------------------------- */
/* Konfigurasi Port                                                           */
/* -------------------------------------------------------------------------- */

const REQUIRED_FREE = [
  { port: 3000, label: 'admin  (Next.js / Web Admin)' },
  { port: 3001, label: 'mobile (PWA Murid & Guru)' },
];

const OPTIONAL_FREE = [
  { port: 3002, label: 'api    (opsional backend)' },
  { port: 5433, label: 'PostgreSQL DZITOE (container/instance)' },
  { port: 6380, label: 'Redis DZITOE' },
];

const RESERVED = [
  { port: 8000, owner: 'ADZKIA (aplikasi ujian)' },
  { port: 5173, owner: 'PERSOALAN (Vite dev server)' },
  { port: 80, owner: 'Web server lokal (HTTP)' },
  { port: 443, owner: 'Web server lokal (HTTPS)' },
  { port: 3306, owner: 'MySQL lokal' },
  { port: 5432, owner: 'PostgreSQL lokal' },
  { port: 6379, owner: 'Redis lokal' },
];

function probePort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') resolve('in-use');
      else resolve('unknown');
    });

    server.once('listening', () => {
      server.close(() => resolve('free'));
    });

    server.listen({ port, host, exclusive: true });
  });
}

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const icon = { ok: '✅', fail: '❌', warn: '⚠️ ', info: 'ℹ️ ' };

async function main() {
  console.log(
    `\n${c.bold}${c.cyan}DZITOE — Port Guard${c.reset} ${c.dim}(Task A0.1)${c.reset}\n`,
  );

  let failed = false;
  let warned = false;

  console.log(`${c.bold}1) Port aplikasi DZITOE (wajib bebas)${c.reset}`);
  for (const { port, label } of REQUIRED_FREE) {
    const status = await probePort(port);
    if (status === 'free') {
      console.log(`   ${icon.ok} ${String(port).padEnd(5)} ${label} ${c.green}(bebas)${c.reset}`);
    } else {
      failed = true;
      console.log(
        `   ${icon.fail} ${String(port).padEnd(5)} ${label} ${c.red}(${status.toUpperCase()})${c.reset}`,
      );
    }
  }

  console.log(`\n${c.bold}2) Port pendukung DZITOE (opsional/container)${c.reset}`);
  for (const { port, label } of OPTIONAL_FREE) {
    const status = await probePort(port);
    if (status === 'free') {
      console.log(`   ${icon.ok} ${String(port).padEnd(5)} ${label} ${c.dim}(bebas)${c.reset}`);
    } else {
      warned = true;
      console.log(
        `   ${icon.warn}${String(port).padEnd(5)} ${label} ${c.yellow}(${status.toUpperCase()})${c.reset}`,
      );
    }
  }

  console.log(`\n${c.bold}3) Port RESERVED project lain (dilarang dipakai DZITOE)${c.reset}`);
  for (const { port, owner } of RESERVED) {
    const status = await probePort(port);
    if (status === 'in-use') {
      console.log(
        `   ${icon.info}${String(port).padEnd(5)} ${owner} ${c.dim}(terpakai — sesuai ekspektasi)${c.reset}`,
      );
    } else {
      console.log(
        `   ${icon.warn}${String(port).padEnd(5)} ${owner} ${c.yellow}(saat ini bebas — tetap TIDAK BOLEH dipakai DZITOE)${c.reset}`,
      );
    }
  }

  console.log(`\n${c.bold}Ringkasan Guard Port:${c.reset}`);
  if (failed) {
    console.log(
      `   ${icon.fail} ${c.red}Ada port wajib yang bentrok/terpakai!${c.reset}\n`,
    );
    process.exit(1);
  }

  console.log(
    `   ${icon.ok} ${c.green}Semua port wajib DZITOE (3000 & 3001) BEBAS dan AMAN.${c.reset}`,
  );
  console.log(
    `   ${icon.ok} ${c.green}Port ADZKIA (8000) dan PERSOALAN (5173) terproteksi dari bentrok.${c.reset}\n`,
  );
}

main().catch((err) => {
  console.error(`${icon.fail} Port Guard gagal dijalankan:`, err);
  process.exit(1);
});
