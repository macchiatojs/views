// TODO: need more test cases
import path from 'path'
import { expect } from 'chai'
import { ViewEngine } from '../src'

describe('ViewEngine', function () {
  it('should render page ok', async () => {
    const engine = new ViewEngine({
      root: path.join(__dirname, 'views'),
      layout: 'template',
      viewExt: 'html',
    })

    const users = [
      { name: 'Jawher' },
      { name: 'Imed' },
      { name: 'Tom' },
    ]
    const html = await engine.tempRender('home', { users })

    expect(html.startsWith('<ul>')).to.be.true
    expect(html.includes('<li>Jawher</li>')).to.be.true
    expect(html.includes('<li>Imed</li>')).to.be.true
    expect(html.includes('<li>Tom</li>')).to.be.true
    expect(html.endsWith('</ul>')).to.be.true
  })
})
