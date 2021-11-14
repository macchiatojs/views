import path from 'path'
import { expect } from 'chai'

import ViewEngine from '../src'

describe('ViewEngine', () => {
  it('should throw when pass invalid settings object', () => {
    expect(
      () =>
        new ViewEngine({
          root: path.join(__dirname, 'views'),
          x: 'hello',
          viewExt: 'html',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    ).to.Throw
  })

  it('should return the complied string from the template', async () => {
    const viewEngine = new ViewEngine({
      root: path.join(__dirname, 'views'),
      viewExt: 'html',
      cache: true
    })

    const users = [{ name: 'Jawher' }, { name: 'Imed' }, { name: 'Tom' }]
    const html = await viewEngine.generateHtml('home', { users })

    expect(html.startsWith('<ul>')).to.be.true
    expect(html.includes('<li>Jawher</li>')).to.be.true
    expect(html.includes('<li>Imed</li>')).to.be.true
    expect(html.includes('<li>Tom</li>')).to.be.true
    expect(html.endsWith('</ul>')).to.be.true
  })
})
