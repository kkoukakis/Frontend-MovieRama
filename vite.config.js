import path from 'path'
import viteCompression from 'vite-plugin-compression'

export default {
    target: 'es2015',
    server: {
        port: 3000,
    },
    preview: {
        port: 8080,
    },
    plugins: [viteCompression()],
}
