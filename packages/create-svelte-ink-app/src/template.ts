import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { PackageManager } from './get-pkg-manager'
import { install } from './install'

interface InstallTemplateArgs {
    appName: string
    root: string
    packageManager: PackageManager
}

export async function installTemplate({
    appName,
    root,
    packageManager
}: InstallTemplateArgs) {
    console.log(chalk.bold(`Using ${packageManager}.`))

    /**
     * Create a package.json for the new project.
     */
    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
        scripts: {

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
     * Default dependencies.
     */
    const dependencies = ['svelte', 'svelte-ink']

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

        await install(root, dependencies, { packageManager })
    }
}
