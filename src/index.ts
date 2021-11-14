// TODO: need more work
import * as ejs from 'ejs'
import path from 'path'
import fs from 'fs/promises'
import type { KeyValueObject } from '@macchiatojs/kernel'

/**
 * default render options
 * @type {Object}
 */
const defaultSettings = {
  cache: true,
  layout: 'layout',
  viewExt: 'html',
  locals: {},
  compileDebug: false,
  debug: false,
  writeResp: true,
  async: false,
}

interface ViewSettings extends ejs.Options {
  root: string,
  // cache: boolean,
  layout: string,
  viewExt: string,
  locals?: ejs.Data,
  compileDebug?: boolean,
  // debug: false,
  writeResp?: boolean,
  async?: boolean
}

/**
 *
 */
export class ViewEngine {
  #settings: ViewSettings
  #cache: KeyValueObject<ejs.TemplateFunction | ejs.AsyncTemplateFunction>

  constructor(settings: ViewSettings) {
    this.#settings = { ...defaultSettings, ...settings }
    this.#settings.root = path.resolve(process.cwd(), settings.root)
    // cache the generate package
    this.#cache = {}
    this.#settings.viewExt = settings.viewExt
      ? '.' + settings.viewExt.replace(/^\./, '')
      : ''
  }

  /**
   * generate html with view name and params
   *
   * @param {String} view
   * @param {Object} params
   * @return {String} html
   */
  async #generateHtml(view: string, params: any) {
    view += this.#settings.viewExt
    const viewPath = path.join(this.#settings.root, view)

    // get from cache
    if (this.#settings.cache && this.#cache[viewPath]) {
      return this.#cache[viewPath](params)
    }

    const template = await fs.readFile(viewPath, 'utf8')

    const ejsTemplateHandler = ejs.compile(template, {
      filename: viewPath,
      _with: this.#settings._with,
      compileDebug: this.#settings.debug && this.#settings.compileDebug,
      debug: this.#settings.debug,
      delimiter: this.#settings.delimiter,
      cache: this.#settings.cache,
      async: this.#settings.async,
      outputFunctionName: this.#settings.outputFunctionName,
    })

    if (this.#settings.cache) this.#cache[viewPath] = ejsTemplateHandler

    return ejsTemplateHandler(params)
  }

  // this is a temp access for generateHtml method
  async tempRender (view: string, params: any){
    return this.#generateHtml(view, params)
  }
}
