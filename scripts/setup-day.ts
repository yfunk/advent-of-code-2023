import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import chalk from 'chalk';
import { formatDay, formatDayName, generateTemplate, isBetween, validateDay } from './utils';
import { fetchInput } from './api';

type File = {
  name: string;
  secret?: boolean;
  getContent?: (options: { year: number; day: number }) => Promise<string | undefined>;
};

const files: Array<File> = [
  {
    name: 'index.ts',
    getContent: async ({ day }) => {
      return generateTemplate(day);
    },
  },
  {
    name: 'input.txt',
    secret: true,
    getContent: async ({ year, day }) => {
      console.log('📄 Fetching input...');

      const input = await fetchInput({ day, year }).catch(() => {
        console.log(chalk.red.bold('❌ Fetching input failed, empty file will be created.'));
      });

      return input ?? undefined;
    },
  },
  {
    name: 'example.txt',
    secret: true,
  },
  // {
  //   name: 'README.md',
  // },
];

const setupDay = async (day: number) => {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`);
    console.log(`🎅 To get started, try: ${chalk.cyan('bun setup 1')}`);
    return;
  }

  const currentYear = new Date().getFullYear();
  const year = Number.parseInt(Bun.env.YEAR ?? currentYear.toString());

  if (Number.isNaN(year) || !isBetween(year, [2015, currentYear])) {
    console.log(
      chalk.red(`📅 Year must be between ${chalk.bold(2015)} and ${chalk.bold(currentYear)}.`)
    );
    return;
  }

  const srcDir = new URL(`../src/${formatDayName(day)}/`, import.meta.url);
  // input files should not be shared publicly, but them in separate directory (git submodule)
  const secretDir = new URL(`../inputs/${formatDayName(day)}/`, import.meta.url);

  console.log(`📂 Setting up day ${formatDay(day)}...`);

  try {
    if (!existsSync(srcDir)) await mkdir(srcDir);
    if (!existsSync(secretDir)) await mkdir(secretDir);

    for (const file of files) {
      const fileUrl = new URL(file.name, file.secret ? secretDir : srcDir);

      if (existsSync(fileUrl)) {
        console.log(`⚠️  ${file.name} already exists.`);
      } else {
        const content = await file.getContent?.({ year, day });

        await Bun.write(fileUrl, content ?? '');
        console.log(`✅ ${file.name} created.`);
      }
    }

    console.log(chalk.green.bold(`🎉 Day ${formatDay(day)} successfully set up!`));
  } catch (err: any) {
    console.error(chalk.red(err?.message ?? 'Failed to set up day'));
  }
};

const day = Number(Bun.argv[2] ?? '') ?? new Date().getDate();
setupDay(day);
