const htmlmin = require('html-minifier-terser')
const buildDir = 'dist'

const shouldTransformHTML = (outputPath) =>
    outputPath &&
    outputPath.endsWith('.html') &&
    process.env.ELEVENTY_ENV === 'production'

const isHomePage = (outputPath) => outputPath === `${buildDir}/index.html`

process.setMaxListeners(Infinity)
module.exports = {
    htmlmin: async function (content, outputPath) {
        if (shouldTransformHTML(outputPath)) {
            return await htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            })
        }
        return content
    },

    critical: async function (content, outputPath) {
        if (shouldTransformHTML(outputPath) && isHomePage(outputPath)) {
            try {
                // Dynamic import for ESM module
                const { generate } = await import('critical')
                const config = {
                    base: `${buildDir}/`,
                    html: content,
                    inline: true,
                    width: 1280,
                    height: 800
                }
                const { html } = await generate(config)
                return html
            } catch (err) {
                console.error(err)
            }
        }
        return content
    }
}
