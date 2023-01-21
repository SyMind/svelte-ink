import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            include: 'src/**',
            typescript: require('typescript')
        })
    ],
    output: [
        {
            file: 'lib/index.js',
            format: 'cjs',
            name: 'svelte',
            sourcemap: true,
        }
    ]
}
