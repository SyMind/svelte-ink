import path from 'path'
import { PackageManager } from './get-pkg-manager'
import { isWriteable } from './is-writeable'
import { isFolderEmpty } from './is-folder-empty'
import { makeDir } from './make-dir'

import { installTemplate } from './template'

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

    await installTemplate({
        appName,
        root,
        packageManager
    })
}
