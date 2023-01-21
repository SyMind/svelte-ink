import path from 'path'
import chalk from 'chalk'
import fs from 'fs'
import os from 'os'
import cpy from 'cpy'
import { PackageManager } from './get-pkg-manager'
import { isWriteable } from './is-writeable'
import { isFolderEmpty } from './is-folder-empty'
import { makeDir } from './make-dir'
import { install } from './install'
import { tryGitInit } from './git'

interface CreateAppArgs {
    appPath: string
    packageManager: PackageManager
}

export async function createApp({ appPath, packageManager }: CreateAppArgs) {
    const root = path.resolve(appPath)

    if (!(await isWriteable(path.dirname(root)))) {
        console.error(
            'The application path is not writable, please check folder permissions and try again.'
        )
        console.error(
            'It is likely you do not have write permissions for this folder.'
        )
        process.exit(1)
    }

    const appName = path.basename(root)

    await makeDir(root)
    if (!isFolderEmpty(root, appName)) {
        process.exit(1)
    }

    const useYarn = packageManager === 'yarn'
    const originalDirectory = process.cwd()
  
    console.log(`Creating a new Svelte Ink app in ${chalk.green(root)}.`)
    console.log()
  
    process.chdir(root)

    console.log(chalk.bold(`Using ${packageManager}.`))

    /**
     * Create a package.json for the new project.
     */
    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {
            // TODO
        }
    }

    /**
     * Write it to disk.
     */
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    )

    /**
     * These flags will be passed to `install()`.
     */
    const installFlags = { packageManager }

    /**
     * Default dependencies.
     */
    const dependencies = ['svelte', 'svelte-ink']
    /**
     * Default devDependencies.
     */
    const devDependencies = ['esbuild']

    /**
     * Install package.json dependencies if they exist.
     */
    if (dependencies.length) {
        console.log()
        console.log('Installing dependencies:')
        for (const dependency of dependencies) {
            console.log(`- ${chalk.cyan(dependency)}`)
        }
        console.log()
  
        await install(root, dependencies, installFlags)
    }
    /**
     * Install package.json devDependencies if they exist.
     */
    if (devDependencies.length) {
        console.log()
        console.log('Installing devDependencies:')
        for (const devDependency of devDependencies) {
            console.log(`- ${chalk.cyan(devDependency)}`)
        }
        console.log()
  
        const devInstallFlags = { devDependencies: true, ...installFlags }
        await install(root, devDependencies, devInstallFlags)
    }
    console.log()
    /**
     * Copy the template files to the target directory.
     */
    await cpy('**', root, {
        parents: true,
        cwd: path.resolve(__dirname, '../template'),
        rename: name => {
            switch (name) {
                case 'gitignore': {
                    return '.'.concat(name)
                }
                // README.md is ignored by webpack-asset-relocator-loader used by ncc:
                // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
                case 'README-template.md': {
                    return 'README.md'
                }
                default: {
                    return name
                }
            }
        }
    })

    if (tryGitInit(root)) {
        console.log('Initialized a git repository.')
        console.log()
    }

    let cdpath: string
    if (path.join(originalDirectory, appName) === appPath) {
        cdpath = appName
    } else {
        cdpath = appPath
    }

    console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`)
}
