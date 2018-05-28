import typescript from 'rollup-plugin-typescript2'

const formats = {
    es: 'index.es.js',
    cjs: 'index.js'
}

export default Object.keys(formats).map(format => ({
    input: './modules/index.ts',
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
            useTsconfigDeclarationDir: true,
            clean: true
        })
    ],
    external: ['react'],
    output: {
        format,
        file: formats[format]
    }
}))
