/**
 * plugins/webfontloader.ts
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

 export async function loadFonts () {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */'webfontloader')

  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap','Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap','Montserrat:100,300,400,500,700,900&display=swap',],
    },
    
  })
}
