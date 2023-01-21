import path from 'path'
import { PackageManager } from './get-pkg-manager'
import { installTemplate } from './template'

interface CreateAppArgs {
    appPath: string
    packageManager: PackageManager
}

export async function createApp({ appPath, packageManager }: CreateAppArgs) {
    const root = path.resolve(appPath)

    const appName = path.basename(root)

    await installTemplate({
        appName,
        root,
        packageManager
    })
}
