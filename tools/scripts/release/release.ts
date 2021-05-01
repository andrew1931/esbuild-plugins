import minimist from 'minimist';
import enquirer from 'enquirer';
import semver from 'semver';

import { Args, releaseTypes, increVersion, runIfNotDry, step } from './util';

import { updateVersion } from './update-version';
import { publishNPMPackage } from './npm-publish';
import { gitPush } from './git-push';

const args = minimist(process.argv.slice(2), {
  alias: {
    'dry-run': 'dryRun',
    'skip-check': 'skipCheck',
    'with-deps': 'withDeps',
  },
}) as Args;

// choose project
// select or input version

async function main() {
  const {
    dryRun = false,
    tag = '',
    withDeps = true,
    version = '',
    skipCheck = false,
  } = args;

  const tmpTargetProject = 'nx-plugin-esbuild';
  const tmpTargetVersion = '0.0.1-1';

  let targetVersion = version;

  if (!version) {
    const { release }: Record<'release', string> = await enquirer.prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: releaseTypes
        .map(
          (incType) => `${incType} (${increVersion(tmpTargetVersion, incType)})`
        )
        .concat(['custom']),
    });

    if (release === 'custom') {
      const { version }: Record<'version', string> = await enquirer.prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: tmpTargetVersion,
      });
      targetVersion = version;
    } else {
      targetVersion = release.match(/\((.*)\)/)[1];
    }

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`);
    }

    const tag = `${tmpTargetProject}@${targetVersion}`;

    const { yes }: Record<'yes', string> = await enquirer.prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing ${tag}. Confirm?`,
      initial: true,
    });

    if (!yes) {
      return;
    }
    step('\nUpdating package version...');
    updateVersion(tmpTargetProject, targetVersion, dryRun);

    step('\nBuilding package...');
    const nxBuildFlags = ['build', tmpTargetProject];

    // TODO: more build flags
    if (withDeps) {
      nxBuildFlags.push('--with-deps');
    }

    await runIfNotDry(dryRun, 'nx', nxBuildFlags);

    // step('\nGenerating changelog...');
    // await run('yarn', ['changelog']);

    await gitPush(tmpTargetProject, tag, dryRun);

    step('\nPublishing package...');
    await publishNPMPackage(tmpTargetProject, targetVersion, args);

    if (args.dryRun) {
      console.log(`\nDry run finished - run git diff to see package changes.`);
    }

    console.log();
  }
}

main();
