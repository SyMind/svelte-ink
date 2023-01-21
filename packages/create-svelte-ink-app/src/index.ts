import chalk from 'chalk'
import path from 'path'
import prompts from 'prompts'
import { getPkgManager } from './get-pkg-manager'
import { validateNpmName } from './validate-pkg'
import { createApp } from './create-app'

async function run() {
    let projectPath = 'my-cli'

    const res = await prompts({
        type: 'text',
        name: 'path',
        message: 'What is your project named?',
        initial: 'my-cli',
        validate: name => {
            const validation = validateNpmName(path.basename(path.resolve(name)))
            if (validation.valid) {
                return true
            }
            return 'Invalid project name: ' + validation.problems![0]
        }
    })

    if (typeof res.path === 'string') {
        projectPath = res.path.trim()
    }
    
    const resolvedProjectPath = path.resolve(projectPath)
    const projectName = path.basename(resolvedProjectPath)

    const { valid, problems } = validateNpmName(projectName)
    if (!valid) {
        console.error(
          `Could not create a project called ${chalk.red(
            `"${projectName}"`
          )} because of npm naming restrictions:`
        )
    
        problems!.forEach((p) => console.error(`    ${chalk.red.bold('*')} ${p}`))
        process.exit(1)
    }

    const packageManager = getPkgManager()

    await createApp({
        appPath: resolvedProjectPath,
        packageManager
    })
}

run()
