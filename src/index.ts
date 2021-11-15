/*!
 * @macchiatojs/views
 *
 *
 * Copyright(c) 2021 Imed Jaberi
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

import * as ejs from 'ejs'
import path from 'path'
import fs from 'fs/promises'
import type { KeyValueObject } from '@macchiatojs/kernel'

/**
 * @type View engine settings
 */
export interface ViewEngineSettings extends ejs.Options {
  root: string
  viewExt?: string
}

/**
 * Macchiato.js view render engine based on ejs.
 * @api public
 */
class ViewEngine {
  #settings: ViewEngineSettings
  #cache: KeyValueObject<ejs.TemplateFunction | ejs.AsyncTemplateFunction>
  static defaultSettings = {
    cache: true,
    viewExt: 'html',
    compileDebug: false,
    debug: false,
    async: false,
  }

  constructor(settings: ViewEngineSettings) {
    // merge default settings and passed settings
    this.#settings = { ...ViewEngine.defaultSettings, ...settings }
    // get the root path of the view directory
    this.#settings.root = path.resolve(process.cwd(), settings.root)
    // cache the generate package
    this.#cache = {}
    // get the view extension [.html, .ejs, ...etc]
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
  async generateHtml<T = unknown>(
    targetViewName: string,
    params: KeyValueObject<T>
  ): Promise<string> {
    // add the extension to the view name
    targetViewName += this.#settings.viewExt
    // get the full path of the target view
    const viewPath = path.join(this.#settings.root, targetViewName)

    // use the cache to return the compiled html string
    if (this.#settings.cache && this.#cache[viewPath])
      return this.#cache[viewPath](params)

    // read the file content
    const template = await fs.readFile(viewPath, 'utf8')

    // use the ejs compiler to get the html string
    const ejsTemplateHandler = ejs.compile(template, {
      filename: viewPath,
      ...this.#settings,
    })

    // handle the cache setting
    if (this.#settings.cache) this.#cache[viewPath] = ejsTemplateHandler

    // return the compiled html string
    return ejsTemplateHandler(params)
  }
}

/**
 * Expose `Router`.
 */

export default ViewEngine

// Support CommonJS
module.exports = ViewEngine
